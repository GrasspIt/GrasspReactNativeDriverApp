import React, { useEffect } from 'react';

import OrderToScan from '../components/OrderToScan';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getProductsInOrderFromProps, ProductInOrder } from "../selectors/orderSelectors";
import { State } from "../store/reduxStoreState";
import { RESET_METRC_ORDER_DETAIL_SCANS_SUCCESS, RESET_METRC_ORDER_SCANS_SUCCESS } from "../actions/metrcActions";
import { completeOrder } from "../actions/orderActions";

const OrderToScanScreen = ({
    navigation,
    route
}) => {
    const { orderId } = route.params;
    const dispatch = useDispatch();

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


    //TODO: Eventually, utilized animated alerts, like in MetrcScanScreen, MetrcScan
    const handleCompleteOrder = (orderId) => {
        dispatch(completeOrder(orderId));
    }

    /**Delete all scans made for a specific orderDetail*/
    const resetOrderDetailScans = (orderId:string, orderDetailId: string) => {
        dispatch({
            type: RESET_METRC_ORDER_DETAIL_SCANS_SUCCESS,
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
            type: RESET_METRC_ORDER_SCANS_SUCCESS,
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
    />
}

export default OrderToScanScreen;