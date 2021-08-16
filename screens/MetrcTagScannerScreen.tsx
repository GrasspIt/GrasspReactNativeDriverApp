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
    const { productId, orderDetailId } = route.params;


    //TODO: Ensure Barcode Scanner / MetrcTagScanner is unmounted once you navigate away from it - see React Navigation docs
    return <MetrcTagScanner />
}

export default MetrcTagScannerScreen;