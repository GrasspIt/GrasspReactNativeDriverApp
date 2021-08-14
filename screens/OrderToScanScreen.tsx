import React from 'react';

import OrderToScan from '../components/OrderToScan';
import { shallowEqual, useSelector } from "react-redux";
import { getProductsInOrderFromProps, ProductsInOrder } from "../selectors/orderSelectors";
import { State } from "../store/reduxStoreState";

const OrderToScanScreen = ({
    navigation,
    route
}) => {
    const { orderId } = route.params;

    const productsInOrder = useSelector<State, ProductsInOrder[]>(
        state => orderId && getProductsInOrderFromProps(state, {orderId}),
        shallowEqual)

    return <OrderToScan
        products={productsInOrder}
        orderId={orderId}
    />
}

export default OrderToScanScreen;