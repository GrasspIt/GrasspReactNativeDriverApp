import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { OrderWithAddressAndUser, RouteLeg } from '../store/reduxStoreState';
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";

interface OrderMapViewProps {
    navigation;
    driver: DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute;
    orderPolyline?: any; //FixMe
    overviewPolyline?: any; //FixMe
    currentlyActiveRouteLegIndex?: number; //FixMe
}

const OrderMapView = () => {
    return;
}

export default OrderMapView;