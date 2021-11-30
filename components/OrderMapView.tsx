import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
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

    const mapRef = useRef<MapView>(null);

    //const [orderMarkers, setOrderMarkers] = useState<any[]>([]);
    const [mapIdentifiers, setMapIdentifiers] = useState<string[]>([]);

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


    const orderMarkers = useMemo(() => {
        const identifiers: string[] = [];
        if( orderAddresses &&
        orderAddresses.length > 0 &&
        orderAddresses) {
            const markers = orderAddresses.map(
                (
                    order: OrderWithAddressAndUser
                ) => {
                    if (!order || !order.address) return null;
                    const orderId = order.id.toString();
                    identifiers.push(orderId);
                    return (
                        <Marker
                            coordinate={{
                                latitude: order.address.latitude,
                                longitude: order.address.longitude,
                            }}
                            {...order}
                            pinColor='red'
                            key={order.address.id}
                            identifier={orderId}
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

            identifiers.push(dsprDriver.id.toString());
            setMapIdentifiers(identifiers);
            return markers;
        }
    }, [orderAddresses]);

    const onMapReadyHandler = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.fitToSuppliedMarkers(mapIdentifiers, {
                edgePadding:
                    {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50
                    }

            })
        }
    }, [mapRef, mapIdentifiers]);

    // Call fitToSuppliedMarkers() method on the MapView after markers get updated
    //useLayoutEffect(() => {
    //    if (mapRef.current) {
    //        // list of _id's must same that has been provided to the identifier props of the Marker
    //        mapRef.current.fitToSuppliedMarkers(orderMarkers.map(({ _id }) => _id));
    //    }
    //}, [markers]);


    /*
    * orderAddresses &&
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
    * */

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
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
                onMapReady={onMapReadyHandler}
            >
                {dsprDriver && dsprDriver.currentLocation && (
                    <Marker
                        pinColor='green'
                        identifier={dsprDriver.id.toString()}
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