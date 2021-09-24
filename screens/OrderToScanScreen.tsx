import React, { useEffect, useMemo } from 'react';

import OrderToScan from '../components/OrderToScan';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { OrderScan, State } from "../store/reduxStoreState";
import {
    deactivateOrderDetailScans,
    deactivateOrderScans,
    RESET_ORDER_DETAIL_SCANS_SUCCESS,
} from "../actions/scanActions";
import {
    getOrderScanCountForOrderFromProps,
    getOrderScansForOrderFromProps,
} from "../selectors/scanSelectors";

const OrderToScanScreen = ({
                               navigation,
                               route
                           }) => {
    const {orderId} = route.params;
    const dispatch = useDispatch();

    //TODO: Remove this useEffect
    useEffect(() => {
        console.log('OrderToScanScreen has mounted!!!');

        return () => {
            console.log('OrderToScanScreen has unmounted!!!!');
        }
    }, [])

    const productsInOrder = useSelector<State, ProductInOrder[]>(
        state => orderId && getProductsInOrderFromProps(state, {orderId}),
        shallowEqual)
    const currentNumberOfScansForOrder = useSelector<State, number>(state => getOrderScanCountForOrderFromProps(state, {orderId}), shallowEqual);
    const orderScans = useSelector<State, { [orderDetailId: number]: OrderScan[] }>(state => getOrderScansForOrderFromProps(state, {orderId}), shallowEqual);

    const totalRequiredScansForOrder = useMemo(() => productsInOrder.reduce(((acc, currVal) => acc + currVal.quantity), 0), []);

    /**Deactivate all scans for an order*/
    const resetOrderScans = () => {
        dispatch<any>(deactivateOrderScans(parseInt(orderId)))
    }

    /**Deactivate all scans for an order detail*/
    const resetOrderDetailScans = (orderDetailId: number) => {
        dispatch<any>(deactivateOrderDetailScans(orderDetailId));
    }

    return <OrderToScan
        products={productsInOrder}
        orderId={orderId}
        navigation={navigation}
        resetOrderDetailScans={resetOrderDetailScans}
        resetOrderScans={resetOrderScans}
        totalRequiredScansForOrder={totalRequiredScansForOrder}
        currentNumberOfScansForOrder={currentNumberOfScansForOrder}
        orderScans={orderScans}
    />
}

export default OrderToScanScreen;