import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Dialog, Card } from 'react-native-paper';
import Colors from '../constants/Colors';
import RoutingButtons from './RoutingButtons';

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
          overviewPolyline: any;
        }[];
    };
    serviceAreas?: DSPRDriverServiceArea[];
  };
  dspr: DSPR;
  createRoute: (
    driverId: number,
    waypoints: OrderWithAddressAndUser[],
    finalDestination: OrderWithAddressAndUser,
    usingFinalDestinationInRoute: Boolean
  ) => any;
}

const DriverRoutePage: React.FC<DriverRoutePageProps> = (props) => {
  const { driver, dspr, createRoute } = props;

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
  const [orderPolyline, setOrderPolyline] = useState<any>();
  const [overviewPolyline, setOverviewPolyline] = useState<any>();

  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showErrorModal, setShowErrorModal] = useState(false);
  // const [showWarningModal, setShowWarningModal] = useState(false);
  // const [modalPrimaryText, setModalPrimaryText] = useState(null);
  // const [modalSecondaryText, setModalSecondaryText] = useState(null);
  const [routeButtonDisabled, setRouteButtonDisabled] = useState(false);

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
        createRoute(driver.id, ordersForRoute, finalOrderForRoute, useFinalOrderInRoute);
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

  return (
    <View style={{ flex: 1 }}>
      <Button
        mode='contained'
        labelStyle={{ color: Colors.light }}
        onPress={() => setOrderSelectionModalOpen(true)}
      >
        Create New Route
      </Button>
      {driver && driver.currentRoute && driver.currentRoute.active && (
        <View style={{ flex: 1 }}>
          <GettingStartedMap
            driver={driver}
            orderPolyline={orderPolyline}
            overviewPolyline={overviewPolyline}
            currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
          />
          <RoutingButtons
            driver={driver}
            ordersCurrentlyInRoute={ordersCurrentlyInRoute}
            currentInProcessOrderInActiveRoute={currentInProcessOrderInActiveRoute}
          />
        </View>
      )}
      {/* <Dialog title="Order Details"
    open={state.showOrderDetails}
    onClose={() => setState({ showOrderDetails: false })}>
    <Card className="driver-page-order-detail-popup-card">
        {state.showOrderDetails &&
            <OrderWithDetailsAndPrices
                hideNote
                order={state.order}
                user={state.order.user}
                address={state.order.address}
            />}
    </Card>
</Dialog> */}
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
