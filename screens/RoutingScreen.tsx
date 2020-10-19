import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RoutingStackParamsList } from '../navigation/RoutingNavigator';
import { Button, useTheme } from 'react-native-paper';

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
import TopNavBar from '../components/TopNavBar';
import OrderSelectionModal from '../components/OrderSelectionModal';
import RoutingButtons from '../components/RoutingButtons';
import RouteMapView from '../components/RouteMapView';
import RouteListView from '../components/RouteListView';

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

  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [routeButtonDisabled, setRouteButtonDisabled] = useState(false);
  const [proposedOrderIdsInRoute, setProposedOrderIdsInRoute] = useState([]);
  const [numberOrdersPerRoute, setNumberOrdersPerRoute] = useState<any>();
  const [ordersForRoute, setOrdersForRoute] = useState([]);
  const [finalOrderForRoute, setFinalOrderForRoute] = useState<any>();
  const [useFinalOrderInRoute, setUseFinalOrderInRoute] = useState(false);
  const [ordersCurrentlyInRoute, setOrdersCurrentlyInRoute] = useState<any>();
  const [currentInProcessOrderInActiveRoute, setCurrentInProcessOrderInActiveRoute] = useState<
    any
  >();
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState<any>();
  const [showListView, setShowListView] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [orderPolyline, setOrderPolyline] = useState<any>();
  const [overviewPolyline, setOverviewPolyline] = useState<any>();

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
  const handleRouteCreationSubmission = () => {
    let resetRoute: boolean = true;
    setRouteButtonDisabled(true);
    if (driver && driver.currentRoute && driver.currentRoute.active) {
      Alert.alert(
        'Override Route?',
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?',
        [
          { text: 'No', style: 'cancel', onPress: () => (resetRoute = false) },
          { text: 'Yes', onPress: () => (resetRoute = true) },
        ]
      );
    }
    if (resetRoute) {
      if (ordersForRoute.length === 0) setRouteError('A route must contain at least 1 order.');
      if (!routeError) {
        createNewRoute(driver.id, ordersForRoute, finalOrderForRoute, useFinalOrderInRoute);
        setOrderSelectionModalOpen(false);
      }
      setRouteButtonDisabled(false);
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
        setNumberOrdersPerRoute(driver.serviceAreas[0].numberOrdersPerRoute);
      } else {
        setNumberOrdersPerRoute(dspr.numberOrdersPerRoute);
      }
    }
    // set polylines and orders in route
    if (driver && driver.currentRoute) {
      if (!driver.currentRoute.active) {
        setOverviewPolyline(undefined);
        setCurrentInProcessOrderInActiveRoute(false);
        setCurrentlyActiveRouteLegIndex(undefined);
        setOrderPolyline(undefined);
      } else {
        if (driver.currentRoute.overviewPolyline) {
          setOverviewPolyline(driver.currentRoute.overviewPolyline);
        }
        // create an object with the ids of orders in route
        const ordersInRoute = {};
        if (driver.queuedOrders && driver.currentRoute.legs) {
          driver.currentRoute.legs.forEach((leg: any) => {
            if (leg.order) ordersInRoute[leg.order.id] = leg.legOrder;
          });
          setOrdersCurrentlyInRoute(ordersInRoute);
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

  // Temporarily autofilling orders into route
  useEffect(() => {
    const orders: any = [];
    if (driver && numberOrdersPerRoute) {
      if (driver.currentInProcessOrder) orders.push(driver.currentInProcessOrder);
      if (driver.queuedOrders) {
        for (
          let i = 0;
          i < driver.queuedOrders.length && orders.length <= numberOrdersPerRoute;
          ++i
        ) {
          if (orders.length === numberOrdersPerRoute) {
            setFinalOrderForRoute(driver.queuedOrders[i]);
            setUseFinalOrderInRoute(false);
          } else {
            orders.push(driver.queuedOrders[i]);
          }
        }
      }
    }
    setOrdersForRoute(orders);
    setProposedOrderIdsInRoute(orders.map((order) => order.id));
  }, [driver, numberOrdersPerRoute]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopNavBar title='Routing' navigation={navigation} />
      <Button
        mode='contained'
        labelStyle={{ color: colors.surface }}
        onPress={() => setOrderSelectionModalOpen(true)}
      >
        Create New Route
      </Button>
      {driver && driver.currentRoute && driver.currentRoute.active && (
        <View style={{ flex: 1 }}>
          {showListView ? (
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
          <RoutingButtons
            setShowListView={setShowListView}
            showListView={showListView}
            driver={driver}
            ordersCurrentlyInRoute={ordersCurrentlyInRoute}
            currentInProcessOrderInActiveRoute={currentInProcessOrderInActiveRoute}
          />
        </View>
      )}
      <OrderSelectionModal
        orderSelectionModalOpen={orderSelectionModalOpen}
        setOrderSelectionModalOpen={setOrderSelectionModalOpen}
        ordersForRoute={ordersForRoute}
        numberOrdersPerRoute={numberOrdersPerRoute}
        driver={driver}
        routeError={routeError}
        routeButtonDisabled={routeButtonDisabled}
        handleRouteCreationSubmission={handleRouteCreationSubmission}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const dsprDriverIdForOrderDetails = state.api.dsprDriverId;
  const driver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: dsprDriverIdForOrderDetails,
  });
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
