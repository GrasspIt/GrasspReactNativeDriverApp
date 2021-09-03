import React, { useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { DspProduct, MetrcTag, OrderDetail, State } from "../store/reduxStoreState";
import MetrcTagScanner from '../components/MetrcTagScanner';
import { getOrderDetailFromProps, getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import {
    RESET_METRC_ORDER_DETAIL_SCANS_SUCCESS,
    RESET_METRC_ORDER_SCANS_SUCCESS,
    METRC_TAG_SUBMIT_SUCCESS, submitMetrcTag, METRC_TAG_SUBMIT, METRC_TAG_SUBMIT_FAILURE
} from "../actions/metrcActions";
import {
    getMetrcScanCountForOrderDetailFromProps, getMetrcScanCountForOrderFromProps,
    getMetrcScansForOrderDetailFromProps,
    getMetrcScansForOrderFromProps
} from "../selectors/metrcSelectors";
import { shallow } from "@testing-library/react-native";
import { getDSPProductFromProps } from "../selectors/dspProductSelector";

const MetrcTagScannerScreen = ({
                                   navigation,
                                   route
                               }) => {

    const {productId, orderDetailId, productName, orderId} = route.params;
    const dispatch = useDispatch();

    const orderDetail = useSelector<State, OrderDetail | undefined>(state => getOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)
    const scanCountForOrderDetail = useSelector<State, number>(state => orderId && orderDetailId && getMetrcScanCountForOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [scannerDisabled, setScannerDisabled] = useState<boolean>(false);


    const showSuccessAlert = () => setSuccessAlertVisible(true);
    const closeSuccessAlert = () => {
        if (orderDetail && scanCountForOrderDetail >= orderDetail.quantity) {
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

    /**Submit a scanned metrc tag to backend*/
    const scanSubmit = (tag) => {
        setScannerDisabled(true);

        //console.log('Scan Data:', tag);
        //TODO: Test the value of tag when you are using actual Metrc tags
        return dispatch<any>(submitMetrcTag(tag, parseInt(orderId), parseInt(productId), parseInt(orderDetailId)))
            .then((response) => {
                console.log('RESPONSE FROM DISPATCH IN METRC SCAN SCREEN:', response)
                if (response.type === METRC_TAG_SUBMIT_SUCCESS) {
                    showSuccessAlert();
                }
                if (response.type === METRC_TAG_SUBMIT_FAILURE) {
                    showErrorAlert()
                    setErrorText(response.error)
                }
                return response;
            })
    }

    return <MetrcTagScanner
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
    />
}

export default MetrcTagScannerScreen;