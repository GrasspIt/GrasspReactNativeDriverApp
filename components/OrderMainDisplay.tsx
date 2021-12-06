import React, { useState } from 'react';
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import RouteAndOrderViewButtons from "./RouteAndOrderViewButtons";
import OrderList from "./OrderList";
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";
import OrderMapView from './OrderMapView';

type OrderMainDisplayProps = {
    navigation;
    dsprDriver: DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute;
    isLoading;
    getDriverData;
    removeOrderAndRefreshRoute;
    deactivateDriverRoute;
    markOrderInProcess;
    cancelOrder;
    orderView: 'list' | 'map';
    setOrderView;
    isFetchingDriver: boolean;
};

const OrderMainDisplay = ({
                              navigation,
                              dsprDriver,
                              isLoading,
                              getDriverData,
                              removeOrderAndRefreshRoute,
                              deactivateDriverRoute,
                              markOrderInProcess,
                              cancelOrder,
                              orderView,
                              setOrderView,
                              isFetchingDriver,
                          }: OrderMainDisplayProps) => {
    const {colors} = useTheme();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = () => {
        return;
    }

    const refreshMessage = dsprDriver && dsprDriver.queuedOrders && dsprDriver.queuedOrders.length > 0
        ? 'Orders Present. Create a route to view orders'
        : 'No current orders. Pull down to refresh'

    return (
        <SafeAreaView style={{flex: 1}}>
            {isLoading ? (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color={colors.primary}/>
                </View>
            ) : dsprDriver && dsprDriver.currentRoute && dsprDriver.currentRoute.active ? (
                <View style={{flex: 1}}>
                    <RouteAndOrderViewButtons view={orderView} setView={setOrderView}/>
                    {orderView === 'list' ? (
                        <OrderList
                            navigation={navigation}
                            dsprDriver={dsprDriver}
                            isLoading={isLoading}
                            getDriverData={getDriverData}
                            removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
                            deactivateDriverRoute={deactivateDriverRoute}
                            markOrderInProcess={markOrderInProcess}
                            cancelOrder={cancelOrder}
                            isFetchingDriver={isFetchingDriver}
                        />
                    ) :
                        <OrderMapView
                            navigation={navigation}
                            dsprDriver={dsprDriver}
                            isLoading={isLoading}
                        />
                    }
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={isFetchingDriver} onRefresh={getDriverData} />}
                >
                    <Text style={{ padding: 10 }}>{refreshMessage}</Text>
                    <Button onPress={() => navigation.navigate('Routing')}>Go to Routing</Button>
                </ScrollView>
            )}
            </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrderMainDisplay;