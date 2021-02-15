import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Button, useTheme, ActivityIndicator, FAB } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import OrderSelectionModal from '../components/OrderSelectionModal';
import RouteActionButton from '../components/RouteActionButton';
import RouteMapView from '../components/RouteMapView';
import RouteListView from '../components/RouteListView';
import RouteViewButtons from '../components/RouteViewButtons';

type Props = {
  navigation;
  driver;
  createDSPRDriverRoute: any;
  isLoading;
  orderIdsInRoute;
  activeRoute;
  routeView;
  setRouteView;
  orderPolyline;
  overviewPolyline;
  currentlyActiveRouteLegIndex;
  currentInProcessOrderInActiveRoute;
  setOrderSelectionModalOpen;
  orderSelectionModalOpen;
  maxOrdersPerRoute;
  removeOrderAndRefreshRoute;
  deactivateDriverRoute;
  markOrderInProcess;
  cancelOrder;
  completeOrder;
  progressDSPRDriverRoute;
};

const RoutingMainDisplay = ({
  navigation,
  driver,
  createDSPRDriverRoute,
  isLoading,
  orderIdsInRoute,
  activeRoute,
  routeView,
  setRouteView,
  orderPolyline,
  overviewPolyline,
  currentlyActiveRouteLegIndex,
  currentInProcessOrderInActiveRoute,
  setOrderSelectionModalOpen,
  orderSelectionModalOpen,
  maxOrdersPerRoute,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
  markOrderInProcess,
  cancelOrder,
  completeOrder,
  progressDSPRDriverRoute,
}: Props) => {
  const { colors } = useTheme();

  // new route header button
  React.useLayoutEffect(() => {
    driver && driver.currentRoute && driver.currentRoute.active
      ? navigation.setOptions({
          headerRight: () => (
            <Button
              mode='text'
              labelStyle={{ color: colors.primary, fontSize: 14 }}
              onPress={() => setOrderSelectionModalOpen(true)}
              disabled={isLoading ? true : false}
            >
              New Route
            </Button>
          ),
        })
      : null;
  }, [navigation, driver]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : driver && driver.currentRoute && driver.currentRoute.active ? (
        <View style={{ flex: 1 }}>
          <RouteViewButtons routeView={routeView} setRouteView={setRouteView} />
          {routeView === 'list' ? (
            <RouteListView
              isLoading={isLoading}
              navigation={navigation}
              ordersForRoute={driver.currentRoute.legs}
              orderIdsInRoute={orderIdsInRoute}
              activeRoute={activeRoute}
              removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
              deactivateDriverRoute={deactivateDriverRoute}
              markOrderInProcess={markOrderInProcess}
              cancelOrder={cancelOrder}
            />
          ) : (
            <RouteMapView
              navigation={navigation}
              driver={driver}
              orderPolyline={orderPolyline}
              overviewPolyline={overviewPolyline}
              currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
            />
          )}
          <RouteActionButton
            driver={driver}
            ordersForRoute={driver.currentRoute.legs}
            currentInProcessOrderInActiveRoute={currentInProcessOrderInActiveRoute}
            orderIdsInRoute={orderIdsInRoute}
            completeOrder={completeOrder}
            progressDSPRDriverRoute={progressDSPRDriverRoute}
            isLoading={isLoading}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={{ padding: 10 }}>No currently active route.</Text>
          <FAB
            label='Create New Route'
            icon='plus'
            onPress={() => setOrderSelectionModalOpen(true)}
            style={styles.fab}
          />
        </View>
      )}
      <OrderSelectionModal
        isLoading={isLoading}
        orderSelectionModalOpen={orderSelectionModalOpen}
        setOrderSelectionModalOpen={setOrderSelectionModalOpen}
        maxOrdersPerRoute={maxOrdersPerRoute}
        driver={driver}
        createDSPRDriverRoute={createDSPRDriverRoute}
      />
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RoutingMainDisplay;
