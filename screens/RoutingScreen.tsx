import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RoutingStackParamsList } from '../navigation/RoutingNavigator';
import { Button, useTheme, ActivityIndicator, FAB } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import {
  DsprDriver,
  User,
  DsprDriverLocation,
  OrderWithAddressAndUser,
  Route,
  DSPRDriverServiceArea,
  DSPR,
  RouteLeg,
  RouteMetrics,
  RouteLegDirection,
} from '../store/reduxStoreState';
import { getDSPRFromProps } from '../selectors/dsprSelectors';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import { createDSPRDriverRoute } from '../actions/driverActions';
import OrderSelectionModal from '../components/OrderSelectionModal';
import RouteActionButton from '../components/RouteActionButton';
import RouteMapView from '../components/RouteMapView';
import RouteListView from '../components/RouteListView';
import RouteViewButtons from '../components/RouteViewButtons';

type RoutingScreenNavigationProp = StackNavigationProp<RoutingStackParamsList, 'Routing'>;
type Props = {
  navigation: RoutingScreenNavigationProp;
  driver: Omit<DsprDriver, 'user'> & {
    user: User;
    currentLocation?: DsprDriverLocation;
    queuedOrders?: OrderWithAddressAndUser[];
    currentInProcessOrder?: OrderWithAddressAndUser;
    currentRoute?: Omit<Route, 'legs'> & {
      legs: Omit<RouteLeg, 'order'> &
        {
          order: OrderWithAddressAndUser;
          routeLegDirections: Omit<RouteLegDirection, 'metrics'> &
            {
              metrics: RouteMetrics;
            }[];
          overviewPolyline: any;
        }[];
    };
    serviceAreas?: DSPRDriverServiceArea[];
  };
  dspr: DSPR;
  createDSPRDriverRoute: any;
  isLoading;
};

const RoutingScreen = ({ navigation, driver, dspr, createDSPRDriverRoute, isLoading }: Props) => {
  const { colors } = useTheme();

  const [ordersForRoute, setOrdersForRoute] = useState<any>();
  const [
    currentInProcessOrderInActiveRoute,
    setCurrentInProcessOrderInActiveRoute,
  ] = useState<any>();
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState<any>();
  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [routeView, setRouteView] = useState('map');
  const [orderPolyline, setOrderPolyline] = useState<any>();
  const [overviewPolyline, setOverviewPolyline] = useState<any>();
  const [maxOrdersPerRoute, setMaxOrdersPerRoute] = useState<any>();

  useEffect(() => {
    // set number orders per route
    if (dspr && dspr.numberOrdersPerRoute) {
      if (
        driver &&
        driver.serviceAreas &&
        driver.serviceAreas[0] &&
        driver.serviceAreas[0].numberOrdersPerRoute
      ) {
        setMaxOrdersPerRoute(driver.serviceAreas[0].numberOrdersPerRoute);
      } else {
        setMaxOrdersPerRoute(dspr.numberOrdersPerRoute);
      }
    }
    // set polylines and orders in route
    if (driver && driver.currentRoute) {
      if (!driver.currentRoute.active) {
        //if no active route
        setOverviewPolyline(undefined);
        setOrderPolyline(undefined);
        setCurrentInProcessOrderInActiveRoute(false);
        setCurrentlyActiveRouteLegIndex(undefined);
      } else {
        //if route is active
        if (driver.currentRoute.overviewPolyline) {
          setOverviewPolyline(driver.currentRoute.overviewPolyline);
        }
        // create an object with the ids of orders in route
        const ordersInRoute = {};
        if (driver.queuedOrders && driver.currentRoute.legs) {
          driver.currentRoute.legs.forEach((leg: any) => {
            if (leg.order) ordersInRoute[leg.order.id] = leg.legOrder;
          });
        }
        // if there is an in-process order, set it to the active leg of the route
        if (
          ordersInRoute &&
          Object.keys(ordersInRoute).length > 0 &&
          driver.currentInProcessOrder
        ) {
          if (Object.keys(ordersInRoute).includes(driver.currentInProcessOrder.id.toString())) {
            setCurrentInProcessOrderInActiveRoute(true);
            setCurrentlyActiveRouteLegIndex(
              driver.currentRoute.legs.findIndex(
                (leg: any) => leg.legOrder === ordersInRoute[driver.currentInProcessOrder.id]
              )
            );
          } else {
            setCurrentInProcessOrderInActiveRoute(false);
            setCurrentlyActiveRouteLegIndex(undefined);
          }
        } else {
          setCurrentInProcessOrderInActiveRoute(false);
        }
      }
    }
    return;
  }, [dspr, driver]);

  // create order leg polyline for map
  useEffect(() => {
    if (
      currentlyActiveRouteLegIndex !== undefined &&
      driver &&
      driver.currentRoute &&
      driver.currentRoute.active &&
      driver.currentRoute.legs
    ) {
      const legPolyline = [];
      const legDirectionPolylines = driver.currentRoute.legs[
        currentlyActiveRouteLegIndex
      ].routeLegDirections.map((routeLegDirection: any) => routeLegDirection.overviewPolyline);
      const finishedArray = legPolyline.concat(...legDirectionPolylines);
      setOrderPolyline(finishedArray);
    } else {
      setOrderPolyline(null);
    }
  }, [driver, currentlyActiveRouteLegIndex]);

  // new route header button
  React.useLayoutEffect(() => {
    driver && driver.currentRoute && driver.currentRoute.active
      ? navigation.setOptions({
          headerRight: () => (
            <Button
              mode='text'
              labelStyle={{ color: colors.primary, fontSize: 14 }}
              onPress={() => setOrderSelectionModalOpen(true)}
              disabled={isLoading}
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : driver && driver.currentRoute && driver.currentRoute.active ? (
        <View style={{ flex: 1 }}>
          <RouteViewButtons routeView={routeView} setRouteView={setRouteView} />
          {routeView === 'list' ? (
            <RouteListView navigation={navigation} ordersForRoute={ordersForRoute} />
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
            ordersForRoute={ordersForRoute}
            currentInProcessOrderInActiveRoute={currentInProcessOrderInActiveRoute}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const mapStateToProps = (state) => {
  const dsprDriverIdForOrderDetails = state.api.dsprDriverId;
  const driver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: dsprDriverIdForOrderDetails,
  });
  const dspr = driver ? getDSPRFromProps(state, { dsprId: driver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  return {
    dspr,
    driver,
    isLoading,
  };
};

const mapDispatchToProps = { createDSPRDriverRoute };

export default connect(mapStateToProps, mapDispatchToProps)(RoutingScreen);
