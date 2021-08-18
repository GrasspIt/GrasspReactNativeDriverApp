import React from 'react';
import { shallowEqual, useSelector } from "react-redux";

import { State } from "../store/reduxStoreState";
import MetrcTagScanner from '../components/MetrcTagScanner';
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";

const MetrcTagScannerScreen = ({
                                   navigation,
                                   route
                               }) => {

    //TODO: decide which props you actually need, based on what you will need to pass to the backend
    const { productId, orderDetailId, productName } = route.params;

    //TODO: get selector for orderDetailId

    const scanSubmit = (data) => {
    //    dispatch action to call backend
    //    return response
    }

    return <MetrcTagScanner
        navigation={navigation}
        productName={productName}
        scanSubmit={scanSubmit}
    />
}

export default MetrcTagScannerScreen;