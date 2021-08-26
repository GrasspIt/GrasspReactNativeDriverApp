import React from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { State } from "../store/reduxStoreState";
import MetrcTagScanner from '../components/MetrcTagScanner';
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { SCAN_METRC_TAG_SUCCESS } from "../actions/metrcActions";

const MetrcTagScannerScreen = ({
                                   navigation,
                                   route
                               }) => {

    //TODO: decide which props you actually need, based on what you will need to pass to the backend
    const { productId, orderDetailId, productName, orderId } = route.params;

    const dispatch = useDispatch();

    //TODO: get selector for orderDetailId

    const scanSubmit = (data) => {
    //    dispatch action to call backend
    //    return response
        dispatch({type: SCAN_METRC_TAG_SUCCESS, response: {entities: {
                    orderId,
                    orderDetailId,
                    metrcTag: data,
                    createdTimestamp: new Date().getTime()
                }}})
    }

    return <MetrcTagScanner
        navigation={navigation}
        productName={productName}
        productId={productId}
        orderDetailId={orderDetailId}
        orderId={orderId}
        scanSubmit={scanSubmit}
    />
}

export default MetrcTagScannerScreen;