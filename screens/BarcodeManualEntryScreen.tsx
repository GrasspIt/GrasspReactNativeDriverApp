import React, { useEffect, useState } from 'react';

import BarcodeManualEntryModal from "../components/BarcodeManualEntryModal";
import {
    ORDER_SCAN_SUBMIT_FAILURE,
    ORDER_SCAN_SUBMIT_SUCCESS,
    submitBarcodeScan,
    SubmitBarcodeScanProps
} from "../actions/scanActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { OrderDetail, State } from "../store/reduxStoreState";
import { getOrderDetailFromProps } from "../selectors/orderSelectors";
import { getOrderScanCountForOrderDetailFromProps } from "../selectors/scanSelectors";
import {
    ActiveMetrcTagForAutoComplete,
    getDSPRActiveMetrcTagsForAutoComplete,
    isBatchDSPRFromProps,
    isMetrcDSPRFromProps,
    isNonComplianceScanningDSPRFromProps
} from "../selectors/dsprSelectors";
import { getActiveMetrcTagsForDSPR } from "../actions/dsprActions";


const BarcodeManualEntryScreen = ({navigation, route}) => {
    const {productName, productId, orderDetailId, orderId, dsprId} = route.params;
    const dispatch = useDispatch();

    const orderDetail = useSelector<State, OrderDetail | undefined>(state => getOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)
    const scanCountForOrderDetail = useSelector<State, number>(state => orderId && orderDetailId && getOrderScanCountForOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)

    const isMetrcDSPR = useSelector<State, boolean | undefined>(state => dsprId && isMetrcDSPRFromProps(state, {dsprId}), shallowEqual);
    const isBatchBasedDSPR = useSelector<State, boolean | undefined>(state => dsprId && isBatchDSPRFromProps(state, {dsprId}), shallowEqual);
    const isNonComplianceScanningDSPR = useSelector<State, boolean>(state => dsprId && isNonComplianceScanningDSPRFromProps(state, {dsprId}), shallowEqual);
    const activeMetrcTagsForAutoComplete = useSelector<State, ActiveMetrcTagForAutoComplete[]>(state => dsprId && getDSPRActiveMetrcTagsForAutoComplete(state, {dsprId}), shallowEqual);

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [isFetchingActiveMetrcTags, setIsFetchingActiveMetrcTags] = useState<boolean>(false);

    useEffect(() => {
        setIsFetchingActiveMetrcTags(true);
        dispatch<any>(getActiveMetrcTagsForDSPR(parseInt(dsprId)))
            .then(response => {
                setIsFetchingActiveMetrcTags(false);
            })
    }, []);

    const showSuccessAlert = () => setSuccessAlertVisible(true);

    /**Close success alert modal. If there are no remaining scans for a product, return user to OrderToScan screen.
     *  -> if scans remain, return driver to scanner page
     *  -> other navigation options may be provided as a property passed to the alert component
     * */
    const closeSuccessAlert = () => {
        setSuccessAlertVisible(false);

        //return driver to OrderToScan (if scans/tag submissions complete for product)
        if (orderDetail && scanCountForOrderDetail >= orderDetail.quantity) {
            navigation.navigate('OrderToScan', {orderId});
            return;
        }
        //return driver to scanner page (if scans remain for product)
        navigation.goBack();
    }

    const showErrorAlert = () => setErrorAlertVisible(true);
    const closeErrorAlert = () => setErrorAlertVisible(false);

    /** Submits tag to backend for verification
     * -> if response is successful and there are remaining scans in the orderDetail, return to scanner (handled in closeSuccessAlert)
     * -> if response is successful and there are not any more scans remaining in the orderDetail, return to OrderToScan (handled by closeSuccessAlert)
     * -> if there is an error, show an error message
     * */
    const submitTagEntry = (barcodeText: string) => {
        const complianceNumber = (isMetrcDSPR || isBatchBasedDSPR) ? barcodeText.toUpperCase() : '';
        //tag for non-metrc dspri is productId-dsprId -> split on -
        const splitTag = isNonComplianceScanningDSPR ? barcodeText.split('-') : [];
        const productIdForBarcodeSubmit = (isMetrcDSPR || isBatchBasedDSPR)? parseInt(productId) : parseInt(splitTag[0]);

        const props: SubmitBarcodeScanProps = isMetrcDSPR
            ? {
                metrcTag: complianceNumber,
                orderId: parseInt(orderId),
                productId: productIdForBarcodeSubmit,
                orderDetailId: parseInt(orderDetailId)
            }
            : isBatchBasedDSPR ? {
                batchNumber: complianceNumber,
                orderId: parseInt(orderId),
                productId: productIdForBarcodeSubmit,
                orderDetailId: parseInt(orderDetailId)
            } : {
                orderId: parseInt(orderId),
                productId: productIdForBarcodeSubmit,
                orderDetailId: parseInt(orderDetailId)
            };

        return dispatch<any>(submitBarcodeScan(props))
            .then((response) => {
                if (response.type === ORDER_SCAN_SUBMIT_SUCCESS) {
                    showSuccessAlert();
                }
                if (response.type === ORDER_SCAN_SUBMIT_FAILURE) {
                    showErrorAlert()
                    const errorMessage = response.error && response.error !== 'No message available'
                        ? response.error
                        : '';
                    setErrorText(errorMessage)
                }
                return response;
            })
    }

    return <BarcodeManualEntryModal
        submitTagEntry={submitTagEntry}
        productName={productName}
        orderId={orderId}
        orderDetailid={orderDetailId}
        productId={productId}
        navigation={navigation}
        successAlertVisible={successAlertVisible}
        errorAlertVisible={errorAlertVisible}
        closeSuccessAlert={closeSuccessAlert}
        closeErrorAlert={closeErrorAlert}
        scanCountForOrderDetail={scanCountForOrderDetail}
        orderDetailQuantity={orderDetail?.quantity}
        errorText={errorText}
        isMetrcDSPR={!!isMetrcDSPR}
        activeMetrcTagsForAutoComplete={activeMetrcTagsForAutoComplete}
        isFetchingActiveMetrcTags={isFetchingActiveMetrcTags}
    />
}

export default BarcodeManualEntryScreen;