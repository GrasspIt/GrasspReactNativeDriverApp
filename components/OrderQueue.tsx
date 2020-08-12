import React, { useState, useEffect } from 'react';
import { Text, Switch } from 'react-native';
import { useDispatch } from "react-redux";
import { setDriverOnCallState } from "../actions/driverActions";
import {  DsprDriver } from "../store/reduxStoreState";
import Colors from '../constants/Colors';

type OrderProps = { dsprDriver: DsprDriver; }

const OrderQueue = ({dsprDriver}: OrderProps) => {
    const dispatch = useDispatch();

    return (
        <>
        <Text>Orders</Text>
        
        </>
    )
};

export default OrderQueue;