import React from 'react';
import { ActivityIndicator, useTheme } from "react-native-paper";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import RouteAndOrderViewButtons from "./RouteAndOrderViewButtons";
import OrderList from "./OrderList";
import { DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute } from "../selectors/dsprDriverSelector";

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
                              setOrderView
                          }: OrderMainDisplayProps) => {
    const {colors} = useTheme();

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
                        />
                    ) : (
                        <>
                        {/*OrderMapView*/}
                            <OrderList
                                navigation={navigation}
                                dsprDriver={dsprDriver}
                                isLoading={isLoading}
                                getDriverData={getDriverData}
                                removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
                                deactivateDriverRoute={deactivateDriverRoute}
                                markOrderInProcess={markOrderInProcess}
                                cancelOrder={cancelOrder}
                            />
                        </>
                    )
                    }
                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={{ padding: 10 }}>No current orders.</Text>
                </View>
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