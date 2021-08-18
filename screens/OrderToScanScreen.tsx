import React, { useEffect } from 'react';

import OrderToScan from '../components/OrderToScan';
import { shallowEqual, useSelector } from "react-redux";
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { State } from "../store/reduxStoreState";

const OrderToScanScreen = ({
    navigation,
    route
}) => {
    const { orderId } = route.params;

    useEffect(() => {
        console.log('OrderToScanScreen has mounted!!!');

        return () => {
            console.log('OrderToScanScreen has unmounted!!!!');
        }
    }, [])

    const productsInOrder = useSelector<State, ProductInOrder[]>(
        state => orderId && getProductsInOrderFromProps(state, {orderId}),
        shallowEqual)

    //TODO: Write useEffect that fetches any previous scans made for order

    //TODO: Write selector getting Metrc scans for order
    // update scanned column for each item based on selector
    // if all items have been scanned in order, enable complete order button

    return <OrderToScan
        products={productsInOrder}
        orderId={orderId}
        navigation={navigation}
    />
}

export default OrderToScanScreen;