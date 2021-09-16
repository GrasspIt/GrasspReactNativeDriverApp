import React, { useEffect, useMemo } from 'react';

import OrderToScan from '../components/OrderToScan';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { OrderScan, State } from "../store/reduxStoreState";
import { RESET_ORDER_DETAIL_SCANS_SUCCESS, RESET_ORDER_SCANS_SUCCESS } from "../actions/metrcActions";
import { completeOrder } from "../actions/orderActions";
import { getOrderScanCountForOrderFromProps, getOrderScansForOrderFromProps } from "../selectors/metrcSelectors";

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
    const isScanningComplete: boolean = currentNumberOfScansForOrder === totalRequiredScansForOrder;

    //TODO: Write useEffect that fetches any previous scans made for order

    //TODO: Write selector getting Metrc scans for order
    // update scanned column for each item based on selector
    // if all items have been scanned in order, enable complete order button


    //TODO: Eventually, utilized animated alerts, like in MetrcScanScreen, MetrcScan
    const handleCompleteOrder = (orderId) => {
        dispatch(completeOrder(orderId));
    }

    /**Delete all scans made for a specific orderDetail*/
    const resetOrderDetailScans = (orderId: string, orderDetailId: string) => {
        dispatch({
            type: RESET_ORDER_DETAIL_SCANS_SUCCESS,
            response: {
                entities: {
                    orderId,
                    orderDetailId,
                }
            }
        })
    }

    /**Delete all scans made for a specific order*/
    const resetOrderScans = (orderId: string) => {
        dispatch({
            type: RESET_ORDER_SCANS_SUCCESS,
            response: {
                entities: {
                    orderId,
                }
            }
        })
    }

    return <OrderToScan
        products={productsInOrder}
        orderId={orderId}
        navigation={navigation}
        handleCompleteOrder={handleCompleteOrder}
        resetOrderDetailScans={resetOrderDetailScans}
        resetOrderScans={resetOrderScans}
        isScanningComplete={isScanningComplete}
        totalRequiredScansForOrder={totalRequiredScansForOrder}
        currentNumberOfScansForOrder={currentNumberOfScansForOrder}
        orderScans={orderScans}
    />
}

export default OrderToScanScreen;