import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Dialog, Card } from 'react-native-paper';
import Colors from '../constants/Colors';

import {
  DsprDriver,
  User,
  DsprDriverLocation,
  OrderWithAddressAndUser,
  Route,
  DSPRDriverServiceArea,
  DSPR,
  RouteLeg,
  RouteLegDirection,
  RouteMetrics,
} from '../store/reduxStoreState';

import { COMPLETE_ORDER_SUCCESS } from '../actions/orderActions';
import OrderSelectionModal from './OrderSelectionModal';
import GettingStartedMap from './GettingStartedMap';

interface DriverRoutePageProps {
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
          overviewPolyline: google.maps.LatLng[];
        }[];
    };
    serviceAreas?: DSPRDriverServiceArea[];
  };
  dspr: DSPR;
  completeOrder: (orderId: number) => any;
  createRoute: (
    driverId: number,
    waypoints: OrderWithAddressAndUser[],
    finalDestination: OrderWithAddressAndUser,
    usingFinalDestinationInRoute: Boolean
  ) => any;
  progressRoute: (routeId: number) => any;
  dsprDriverIdForOrderDetails: number;
  handleMapOrderClick: (order: any) => any;
}

const DriverRoutePage: React.FC<DriverRoutePageProps> = (props) => {
  const {
    driver,
    dspr,
    createRoute,
    completeOrder,
    progressRoute,
    dsprDriverIdForOrderDetails,
    handleMapOrderClick,
  } = props;

  //For creating new Route
  const [proposedOrderIdsInRoute, setProposedOrderIdsInRoute] = useState([]);
  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [numberOrdersPerRoute, setNumberOrdersPerRoute] = useState<any>();
  const [ordersForRoute, setOrdersForRoute] = useState([]);
  const [finalOrderForRoute, setFinalOrderForRoute] = useState<any>();
  const [useFinalOrderInRoute, setUseFinalOrderInRoute] = useState(false);

  const [ordersCurrentlyInRoute, setOrdersCurrentlyInRoute] = useState<any>();
  const [currentInProcessOrderInActiveRoute, setCurrentInProcessOrderInActiveRoute] = useState<
    any
  >();
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState<any>();

  const [routeError, setRouteError] = useState('');
  const [polylineForMap, setPolylineForMap] = useState<any>();
  const [overviewPolyline, setOverviewPolyline] = useState<any>();

  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showErrorModal, setShowErrorModal] = useState(false);
  // const [showWarningModal, setShowWarningModal] = useState(false);
  // const [modalPrimaryText, setModalPrimaryText] = useState(null);
  // const [modalSecondaryText, setModalSecondaryText] = useState(null);
  const [routeButtonDisabled, setRouteButtonDisabled] = useState(false);

  const handleRouteCreationSubmission = () => {
    let resetRoute: boolean = true;
    setRouteButtonDisabled(true);
    if (driver.currentRoute && driver.currentRoute.active) {
      Alert.alert(
        'Override Route?',
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => (resetRoute = true) },
        ]
      );
    }
    if (resetRoute) {
      if (ordersForRoute.length > 0) {
        if (!routeError) {
          createRoute(driver.id, ordersForRoute, finalOrderForRoute, useFinalOrderInRoute);
          setRouteButtonDisabled(false);
          setOrderSelectionModalOpen(false);
        } else {
          setRouteButtonDisabled(false);
        }
      } else {
        setRouteError('A route must contain at least 1 order.');
        setRouteButtonDisabled(false);
      }
    } else {
      setRouteButtonDisabled(false);
    }
  };

  const handleRouteActionButtonPressed = () => {
    let currentRouteId = driver.currentRoute && driver.currentRoute.id;
    if (ordersCurrentlyInRoute) {
      if (driver.currentInProcessOrder) {
        if (
          !Object.keys(ordersCurrentlyInRoute).includes(driver.currentInProcessOrder.id.toString())
        ) {
          // The current in-process order is not an order in the route, so it shouldn't assume to be completed before the next order is started
          // Confirmation page asking whether the current order they are doing should be completed or not
          const completeInProcessOrder = window.confirm(
            'You currently have an in-process order that is not part of the route. Would you like to mark this order as complete and continue with your route?'
          );
          if (completeInProcessOrder) {
            completeOrder(driver.currentInProcessOrder.id).then((response) => {
              if (response.type === COMPLETE_ORDER_SUCCESS) {
                progressRoute(driver.currentRoute.id);
              }
            });
          } else {
            progressRoute(driver.currentRoute.id);
          }
        } else {
          completeOrder(driver.currentInProcessOrder.id);
        }
      } else {
        progressRoute(driver.currentRoute.id);
      }
    }
  };

  // set number orders per route
  useEffect(() => {
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
  }, [dspr.numberOrdersPerRoute, driver.serviceAreas]);

  useEffect(() => {
    if (driver && driver.currentRoute && !driver.currentRoute.active) {
      setOverviewPolyline(undefined);
      setCurrentInProcessOrderInActiveRoute(false);
      setCurrentlyActiveRouteLegIndex(undefined);
      setPolylineForMap(undefined);
    } else {
      if (driver && driver.currentRoute && driver.currentRoute.overviewPolyline) {
        setOverviewPolyline(driver.currentRoute.overviewPolyline);
      }

      // create an object with the ids of orders in route
      const ordersInRoute = {};
      if (driver && driver.queuedOrders && driver.currentRoute && driver.currentRoute.legs) {
        driver.currentRoute.legs.forEach((leg: any) => {
          if (leg.order) ordersInRoute[leg.order.id] = leg.legOrder;
        });
        setOrdersCurrentlyInRoute(ordersInRoute);
      }

      // if there is an in-process order, set it to the active leg of the route
      if (
        driver &&
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
      }
    }
  }, [driver]);

  useEffect(() => {
    if (
      currentlyActiveRouteLegIndex !== undefined &&
      driver.currentRoute &&
      driver.currentRoute.active &&
      driver.currentRoute.legs
    ) {
      const legPolyline = [];
      const legDirectionPolylines = driver.currentRoute.legs[
        currentlyActiveRouteLegIndex
      ].routeLegDirections.map((routeLegDirection: any) => routeLegDirection.overviewPolyline);
      const finishedArray = legPolyline.concat(...legDirectionPolylines);
      setPolylineForMap(finishedArray);
    } else {
      setPolylineForMap(null);
    }
  }, [currentlyActiveRouteLegIndex]);

  //Temporarily autofilling orders into route
  useEffect(() => {
    const orders: any = [];
    //if modal not open, then continue with this, however we need to skip the prefill when the modal is open
    if (numberOrdersPerRoute) {
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

  return (
    <View style={{ flex: 1 }}>
      {driver && (!driver.currentRoute || (driver.currentRoute && !driver.currentRoute.active)) && (
        <Button
          mode="contained"
          labelStyle={{ color: Colors.light }}
          onPress={() => setOrderSelectionModalOpen(true)}
        >
          Create New Route
        </Button>
      )}
      {driver.currentRoute && driver.currentRoute.active && (
        <View>
          {
            <GettingStartedMap
              driver={driver}
              orderPolyline={polylineForMap}
              overviewPolyline={overviewPolyline}
              currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
              handleMapOrderClick={handleMapOrderClick}
            />
          }
          <View>
            <Button
              mode="contained"
              labelStyle={{ color: Colors.light }}
              onPress={() => handleRouteActionButtonPressed()}
            >
              {!currentInProcessOrderInActiveRoute ? 'Begin Next Leg' : 'Complete Order'}
            </Button>
            {/* { TODO: Make a note here that any in-process orders should be completed before a route is started } */}
            <Button
              mode="contained"
              labelStyle={{ color: Colors.light }}
              onPress={() => setOrderSelectionModalOpen(true)}
            >
              Create New Route
            </Button>
          </View>
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

      {/* {showSuccessModal && (
        <SweetAlert
          success
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={modalPrimaryText}
          onConfirm={() => setShowSuccessModal(false)}
          showConfirm={false}
        >
          {modalSecondaryText}
        </SweetAlert>
      )}
      {showErrorModal && (
        <SweetAlert
          error
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={modalPrimaryText}
          onConfirm={() => setShowErrorModal(false)}
          showConfirm={false}
        >
          {modalSecondaryText}
        </SweetAlert>
      )}
      {showWarningModal && (
        <SweetAlert
          warning
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={'Route Changed'}
          onConfirm={() => setShowWarningModal(false)}
          showConfirm={false}
        >
          {'Due to some order changes, your route has been modified'}
        </SweetAlert>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  orders: {
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
});

export default DriverRoutePage;
