import React, { useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { OrderDetail, State } from "../store/reduxStoreState";
import BarcodeScanner from '../components/BarcodeScanner';
import { getOrderDetailFromProps } from "../selectors/orderSelectors";
import {
    ORDER_SCAN_SUBMIT_SUCCESS,
    submitBarcodeScan,
    ORDER_SCAN_SUBMIT_FAILURE, SubmitBarcodeScanProps,
} from "../actions/scanActions";
import { getOrderScanCountForOrderDetailFromProps } from "../selectors/scanSelectors";
import { isMetrcLicenseHeldByDSPRFromProps, isNonMetrcScanningDSPRFromProps } from "../selectors/dsprSelectors";
import { shallow } from "@testing-library/react-native";


const BarcodeScannerScreen = ({
                                  navigation,
                                  route
                              }) => {

    const {productId, orderDetailId, productName, orderId, dsprId} = route.params;
    const dispatch = useDispatch();

    const orderDetail = useSelector<State, OrderDetail | undefined>(state => getOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)
    const scanCountForOrderDetail = useSelector<State, number>(state => orderId && orderDetailId && getOrderScanCountForOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)
    const isMetrcDSPR = useSelector<State, boolean>(state => dsprId && isMetrcLicenseHeldByDSPRFromProps(state, {dsprId}), shallowEqual);
    const isNonMetrcScanningDSPR = useSelector<State, boolean>(state => dsprId && isNonMetrcScanningDSPRFromProps(state, {dsprId}), shallowEqual);

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [scannerDisabled, setScannerDisabled] = useState<boolean>(false);


    const showSuccessAlert = () => setSuccessAlertVisible(true);
    const closeSuccessAlert = () => {
        if (orderDetail && scanCountForOrderDetail >= orderDetail.quantity) {
            setSuccessAlertVisible(false);
            navigation.goBack();
            return;
        }
        setSuccessAlertVisible(false);
        setScannerDisabled(false);
    }

    const showErrorAlert = () => setErrorAlertVisible(true);
    const closeErrorAlert = () => {
        setErrorAlertVisible(false);
        setScannerDisabled(false);
    }

    /**Submit a scanned barcode to backend*/
    const scanSubmit = (barcode) => {
        //Scanner is disabled until whatever alert is shown from the dispatch response is closed
        setScannerDisabled(true);

        let scannedProductId;

        if (isNonMetrcScanningDSPR) {
            //barcode is productId-dsprId -> split on -
            const splitTag = barcode.split('-');
            console.log('!!!!!splitTag in scanSubmit:', splitTag);
            scannedProductId = parseInt(splitTag[0]);
        }

        const productIdForBarcodeSubmit = isMetrcDSPR ? parseInt(productId) : scannedProductId;

        //Prepare props for either metrcDSPR or nonMetrcScanningDSPR
        const props: SubmitBarcodeScanProps = isMetrcDSPR
            ? {
                metrcTag: barcode,
                orderId: parseInt(orderId),
                productId: productIdForBarcodeSubmit,
                orderDetailId: parseInt(orderDetailId)
            }
            : {
                orderId: parseInt(orderId),
                productId: productIdForBarcodeSubmit,
                orderDetailId: parseInt(orderDetailId)
            };

        dispatch<any>(submitBarcodeScan(props))
            .then((response) => {
                if (response.type === ORDER_SCAN_SUBMIT_SUCCESS) {
                    showSuccessAlert();
                }
                if (response.type === ORDER_SCAN_SUBMIT_FAILURE) {
                    showErrorAlert()
                    setErrorText(response.error)
                }
            })
    }

    return <BarcodeScanner
        navigation={navigation}
        productName={productName}
        productId={productId}
        orderDetailId={orderDetailId}
        orderId={orderId}
        scanSubmit={scanSubmit}
        scanCountForOrderDetail={scanCountForOrderDetail}
        orderDetail={orderDetail}
        successAlertVisible={successAlertVisible}
        errorAlertVisible={errorAlertVisible}
        closeSuccessAlert={closeSuccessAlert}
        closeErrorAlert={closeErrorAlert}
        scannerDisabled={scannerDisabled}
        errorText={errorText}
        dsprId={parseInt(dsprId)}
    />
}

export default BarcodeScannerScreen;