import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { OrderWithAddressAndUser, RouteLeg, State } from '../store/reduxStoreState';
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";
import {
    getQueuedAndInProcessOrdersWithAddressesForDriverFromProps,
    QueuedAndInProcessOrdersWithAddressesForDriver,
    getQueuedAndInProcessOrdersWithAddressesForDriverAsArrayFromProps,
    QueuedAndInProcessOrdersWithAddressesForDriverAsArray,
    OrderWithAddress, getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps,
} from '../selectors/orderSelectors';
import { useSelector, shallowEqual } from 'react-redux';


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

    const driverName = dsprDriver && dsprDriver.user && dsprDriver.user.firstName + ' ' + dsprDriver.user.lastName;

    // const orderAddresses = useSelector<State, QueuedAndInProcessOrdersWithAddressesForDriver>(
    //     state => getQueuedAndInProcessOrdersWithAddressesForDriverFromProps(state, {dsprDriverId: dsprDriver.id}), shallowEqual)

    // console.log('orderAddresses in OrderMapView:', orderAddresses);

    const orderAddresses1 = useSelector<State, any>(
        state => getQueuedAndInProcessOrdersWithAddressesForDriverAsArrayFromProps(state, {dsprDriverId: dsprDriver.id}), shallowEqual);

    const orderAddresses = useSelector<State, OrderWithAddressAndUser[]>(
        state => getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps(
            state, {dsprDriverId: dsprDriver.id}),
        shallowEqual);
    console.log('orderAddresses1 as array:', orderAddresses1);

    console.log('dsprDriver in OrderMapView:', dsprDriver);


    const orderMarkers =
        orderAddresses &&
        orderAddresses.length > 0 &&
        orderAddresses
            .map(
                (
                    order: OrderWithAddressAndUser
                ) => {
                    if (!order || !order.address) return null;
                    return (
                        <Marker
                            coordinate={{
                                latitude: order.address.latitude,
                                longitude: order.address.longitude,
                            }}
                            {...order}
                            pinColor='red'
                            key={order.address.id}
                        >
                            <Callout onPress={() => navigation.navigate('Details', {orderId: order.id})}>
                                 <Text>{order.user.firstName + ' ' + order.user.lastName}</Text>
                                <Text style={{color: '#2089dc'}}>Order Details</Text>
                            </Callout>
                        </Marker>
                    );
                }
            )
            .filter((marker) => marker != null);

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                //initialRegion={
                //    routeCenter && onOverview
                //        ? {
                //            latitude: routeCenter.lat,
                //            longitude: routeCenter.lng,
                //            latitudeDelta: 0.1,
                //            longitudeDelta: 0.1,
                //        }
                //        : polylineCenter && {
                //        latitude: polylineCenter.lat,
                //        longitude: polylineCenter.lng,
                //        latitudeDelta: 0.1,
                //        longitudeDelta: 0.1,
                //    }
                //}
            >
                {dsprDriver && dsprDriver.currentLocation && (
                    <Marker
                        pinColor='green'
                        coordinate={{
                            latitude: dsprDriver.currentLocation.latitude,
                            longitude: dsprDriver.currentLocation.longitude,
                        }}
                    >
                        <Callout>
                            <Text>{driverName}</Text>
                            <Text>
                                Outstanding Orders:{' '}
                                {orderAddresses.length}
                            </Text>
                        </Callout>
                    </Marker>
                )}
                {/*{!onOverview ? (*/}
                {/*    <Polyline*/}
                {/*        coordinates={orderPolylineCoordinates}*/}
                {/*        geodesic={true}*/}
                {/*        strokeColor='#03adfc'*/}
                {/*        strokeWidth={5}*/}
                {/*        lineDashPattern={[0]}*/}
                {/*    />*/}
                {/*) : (*/}
                {/*    <Polyline*/}
                {/*        coordinates={overviewPolylineCoordinates}*/}
                {/*        geodesic={true}*/}
                {/*        strokeColor='#03adfc'*/}
                {/*        strokeWidth={5}*/}
                {/*        lineDashPattern={[0]}*/}
                {/*    />*/}
                {/*)}*/}
                {orderMarkers && orderMarkers.length > 0 && orderMarkers}
            </MapView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default OrderMapView;