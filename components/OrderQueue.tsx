import React, { useState, useEffect } from 'react';
import { Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { State, Order } from "../store/reduxStoreState";
import { getOrders } from '../selectors/orderSelectors';
import { DsprDriver } from "../store/reduxStoreState";
import Colors from '../constants/Colors';

type OrderProps = { dsprDriver: DsprDriver; }

const OrderQueue = ({dsprDriver}: OrderProps) => {
    const dispatch = useDispatch();

    const orders = useSelector<State, Order>(getOrders);
    const orderList = Object.values(orders);

    useEffect(() => {
      console.log({orderList})
    }, [orderList])

    return (
      <FlatList
        data={orderList}
        renderItem={item => <Text>{item.item.id}</Text>}
        keyExtractor={(item: any) => item.id.toString()}
      />
    )
};

export default OrderQueue;