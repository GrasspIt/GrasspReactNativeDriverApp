import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RoutingStackParamsList } from '../navigation/RoutingNavigator';
import { Button, useTheme } from 'react-native-paper';
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
  isLoading: Boolean;
  error: any;
};

const RoutingScreen = ({
  navigation,
  driver,
  dspr,
  createDSPRDriverRoute,
  isLoading,
  error,
}: Props) => {
  const { colors } = useTheme();

  const [ordersForRoute, setOrdersForRoute] = useState<any>();
  const [finalOrderForRoute, setFinalOrderForRoute] = useState<any>();
  const [currentInProcessOrderInActiveRoute, setCurrentInProcessOrderInActiveRoute] = useState<
    any
  >();
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState<any>();
  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [routeView, setRouteView] = useState('map');
  const [orderPolyline, setOrderPolyline] = useState<any>();
  const [overviewPolyline, setOverviewPolyline] = useState<any>();
  const [maxOrdersPerRoute, setMaxOrdersPerRoute] = useState<any>();

  useEffect(() => {
    if (error) Alert.alert('ERROR', error);
  }, [error]);

  const createNewRoute = (
    driverId: number,
    waypoints: OrderWithAddressAndUser[],
    finalDestination: any,
    usingFinalDestinationInRoute: Boolean
  ) => {
    const orderIds = waypoints.map((order) => ({ id: order.id }));
    if (!finalDestination) {
      finalDestination = orderIds.pop();
      usingFinalDestinationInRoute = true;
    } else {
      finalDestination = { id: finalDestination.id };
    }
    createDSPRDriverRoute(driverId, orderIds, finalDestination, usingFinalDestinationInRoute);
  };

  // function to create a new route
  const handleRouteCreation = () => {
    if (ordersForRoute.length === 0) {
      Alert.alert('A route must contain at least 1 order.');
      return;
    }
    createNewRoute(driver.id, ordersForRoute, finalOrderForRoute, false);
    setOrderSelectionModalOpen(false);
  };

  // check if there is already an active route
  const confirmCreateRoute = () => {
    if (driver && driver.currentRoute && driver.currentRoute.active) {
      Alert.alert(
        'Override Route?',
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => handleRouteCreation() },
        ]
      );
    } else {
      handleRouteCreation();
    }
  };

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

  useEffect(() => {
    // create an array with in process order and all queued orders
    const routeOrders =
      driver && driver.currentInProcessOrder && driver.queuedOrders
        ? [driver.currentInProcessOrder, ...driver.queuedOrders]
        : driver && driver.currentInProcessOrder
        ? [driver.currentInProcessOrder]
        : driver && driver.queuedOrders
        ? [...driver.queuedOrders]
        : [];

    // slice the array up to the max order length
    const updatedOrdersForRoute = routeOrders.slice(0, maxOrdersPerRoute);

    setFinalOrderForRoute(updatedOrdersForRoute[updatedOrdersForRoute.length - 1]);
    setOrdersForRoute(updatedOrdersForRoute);
  }, [driver, maxOrdersPerRoute]);

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
            >
              New Route
            </Button>
          ),
        })
      : null;
  }, [navigation, driver]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            <RouteListView navigation={navigation} driver={driver} />
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
          <Button
            mode='contained'
            labelStyle={{ color: colors.surface, fontSize: 14 }}
            onPress={() => setOrderSelectionModalOpen(true)}
          >
            Create New Route
          </Button>
        </View>
      )}
      <OrderSelectionModal
        orderSelectionModalOpen={orderSelectionModalOpen}
        setOrderSelectionModalOpen={setOrderSelectionModalOpen}
        ordersForRoute={ordersForRoute}
        maxOrdersPerRoute={maxOrdersPerRoute}
        driver={driver}
        confirmCreateRoute={confirmCreateRoute}
      />
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const dsprDriverIdForOrderDetails = state.api.dsprDriverId;
  const driver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: dsprDriverIdForOrderDetails,
  });
  console.log('driver', driver);
  const dspr = driver ? getDSPRFromProps(state, { dsprId: driver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  const error = state.api.errorMessage;
  return {
    dspr,
    driver,
    isLoading,
    error,
  };
};

const mapDispatchToProps = { createDSPRDriverRoute };

export default connect(mapStateToProps, mapDispatchToProps)(RoutingScreen);
