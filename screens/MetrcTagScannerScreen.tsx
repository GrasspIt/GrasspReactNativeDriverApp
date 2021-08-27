import React, { useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { DspProduct, MetrcTag, OrderDetail, State } from "../store/reduxStoreState";
import MetrcTagScanner from '../components/MetrcTagScanner';
import { getOrderDetailFromProps, getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { SCAN_METRC_TAG_SUCCESS } from "../actions/metrcActions";
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

    //TODO: decide which props you actually need, based on what you will need to pass to the backend
    const {productId, orderDetailId, productName, orderId} = route.params;

    const orderDetail = useSelector<State, OrderDetail | undefined>(state => getOrderDetailFromProps(state, {orderId, orderDetailId}), shallowEqual)
    const scanCountForOrderDetail = useSelector<State, number>(state => orderId && orderDetailId && getMetrcScanCountForOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);
    const [successAlertButtonText, setSuccessAlertButtonText] = useState('Ok');

    const showSuccessAlert = () => setSuccessAlertVisible(true);
    const closeSuccessAlert = () => {
        setSuccessAlertVisible(false);

        //TODO: Decide where to send the user
        // -> if scans need to still be completed for the product, send driver back to scanner page
        // -> if scans are done for the product, send driver back to OrdersToScan page
        //navigation.navigate('OrderToScan', {orderId})

        if (orderDetail && scanCountForOrderDetail >= orderDetail.quantity) {
            navigation.goBack();
        }
    }
    const showErrorAlert = () => setErrorAlertVisible(true);
    const closeErrorAlert = () => setErrorAlertVisible(false);


    const dispatch = useDispatch();

    //TODO: get selector for orderDetailId

    const scanSubmit = (data) => {
        //    dispatch action to call backend
        //    return response
        dispatch({
            type: SCAN_METRC_TAG_SUCCESS, response: {
                entities: {
                    orderId,
                    orderDetailId,
                    metrcTag: data,
                    createdTimestamp: new Date().getTime()
                }
            }
        })
        //alert(`orderDetailQuantity: ${orderDetail?.quantity}, scanCount: ${scanCountForOrderDetail}`)

    //    assuming dispatch is successful
        showSuccessAlert();
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
        //successAlertButtonText={successAlertButtonText}
    />
}

export default MetrcTagScannerScreen;