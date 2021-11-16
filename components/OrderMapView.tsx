import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { OrderWithAddressAndUser, RouteLeg, State } from '../store/reduxStoreState';
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";
import { getQueuedAndInProcessOrdersWithAddressesForDriverFromProps, getQueuedAndInProcessOrdersWithAddressesForDriver } from '../selectors/orderSelectors';
import { useSelector } from 'react-redux';


interface OrderMapViewProps {
    navigation;
    dsprDriver: DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute;
    isLoading: boolean;
    orderPolyline?: any; //FixMe
    overviewPolyline?: any; //FixMe
    currentlyActiveRouteLegIndex?: number; //FixMe
}

const OrderMapView = ({
    navigation,
    dsprDriver,
}: OrderMapViewProps) => {

    const orderAddresses = useSelector<State, getQueuedAndInProcessOrdersWithAddressesForDriver>(state => getQueuedAndInProcessOrdersWithAddressesForDriverFromProps(state, {driverId: dsprDriver.id}))

    console.log('orderAddresses in OrderMapView:', orderAddresses);

    return(
        <></>
    )
}

export default OrderMapView;