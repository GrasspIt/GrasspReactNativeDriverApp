import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { DSPR, OrderWithAddressAndUser, RouteLeg, State } from '../store/reduxStoreState';
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";
import {
    getQueuedAndInProcessOrdersWithAddressesForDriverFromProps,
    QueuedAndInProcessOrdersWithAddressesForDriver,
    getQueuedAndInProcessOrdersWithAddressesForDriverAsArrayFromProps,
    QueuedAndInProcessOrdersWithAddressesForDriverAsArray,
    OrderWithAddress, getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps,
} from '../selectors/orderSelectors';
import { useSelector, shallowEqual } from 'react-redux';
import { getDSPRFromProps } from "../selectors/dsprSelectors";


interface OrderMapViewProps {
    navigation;
    dsprDriver: DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute;
    isLoading: boolean;
}

const OrderMapView = ({
                          navigation,
                          dsprDriver,
                      }: OrderMapViewProps) => {

    const mapRef = useRef<MapView>(null);

    const [orderMarkers, setOrderMarkers] = useState<any[]>([]);
    const [mapIdentifiers, setMapIdentifiers] = useState<string[]>([]);

    const driverName = dsprDriver && dsprDriver.user && dsprDriver.user.firstName + ' ' + dsprDriver.user.lastName;

    const orderAddresses = useSelector<State, OrderWithAddressAndUser[]>(
        state => getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps(
            state, {dsprDriverId: dsprDriver.id}),
        shallowEqual);

    const dspr = useSelector<State, DSPR>(state => getDSPRFromProps(state, {dsprId: dsprDriver.dspr}), shallowEqual);

    useLayoutEffect(() => {
        const identifiers: string[] = [];
        if (orderAddresses &&
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

            setOrderMarkers(markers);
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

    const initialRegion = dspr && dspr.centralLatitude && dspr.centralLongitude ? {
        latitude: dspr.centralLatitude,
        longitude: dspr.centralLongitude,
        latitudeDelta: 1,
        longitudeDelta: 1
    } : undefined;

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                onMapReady={onMapReadyHandler}
                initialRegion={initialRegion}
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