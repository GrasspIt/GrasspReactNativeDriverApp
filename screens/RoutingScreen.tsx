import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RoutingStackParamsList } from '../navigation/RoutingNavigator';
import { connect, shallowEqual, useSelector } from 'react-redux';
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
  RouteLegDirection, State,
} from '../store/reduxStoreState';
import { getDSPRFromProps, isScanningRequiredForDSPRFromProps } from '../selectors/dsprSelectors';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import {
  createDSPRDriverRoute,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
} from '../actions/driverActions';
import { progressDSPRDriverRoute } from '../actions/driverActions';
import { markOrderInProcess, cancelOrder, completeOrder } from '../actions/orderActions';
import { getRouteLegs, getRoutes } from '../selectors/dsprDriverRouteSelectors';
import RoutingMainDisplay from '../components/RoutingMainDisplay';
import { isScanningCompleteForOrderFromProps } from "../selectors/scanSelectors";

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
  dspr?: DSPR;
  createDSPRDriverRoute: any;
  isLoading: boolean;
  orderIdsInRoute;
  activeRoute;
  removeOrderAndRefreshRoute;
  deactivateDriverRoute;
  markOrderInProcess;
  cancelOrder;
  completeOrder;
  progressDSPRDriverRoute;
};

const RoutingScreen = ({
  navigation,
  driver,
  dspr,
  createDSPRDriverRoute,
  isLoading,
  orderIdsInRoute,
  activeRoute,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
  markOrderInProcess,
  cancelOrder,
  completeOrder,
  progressDSPRDriverRoute,
}: Props) => {
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
  const [ordersInRoute, setOrdersInRoute] = useState<any>();

  const isScanningDSPR = useSelector<State, boolean | undefined>(state => dspr && isScanningRequiredForDSPRFromProps(state, {dsprId: dspr.id}), shallowEqual);
  const isScanningComplete = useSelector<State, boolean | undefined>(state => driver && driver.currentInProcessOrder && isScanningDSPR && isScanningCompleteForOrderFromProps(state, {orderId: driver.currentInProcessOrder.id}), shallowEqual);

  const setNumberOrdersPerRoute = () => {
    if (
      driver &&
      driver.serviceAreas &&
      driver.serviceAreas[0] &&
      driver.serviceAreas[0].numberOrdersPerRoute
    ) {
      setMaxOrdersPerRoute(driver.serviceAreas[0].numberOrdersPerRoute);
    } else {
      setMaxOrdersPerRoute(dspr?.numberOrdersPerRoute);
    }
  };

  const createOrdersInRoute = () => {
    // create an object with the ids of the orders in route
    const orderIdsInRoute = {};
    if (driver.queuedOrders && driver?.currentRoute?.legs) {
      driver.currentRoute.legs.forEach((leg: any) => {
        if (leg.order) orderIdsInRoute[leg.order.id] = leg.legOrder;
      });
    }
    setOrdersInRoute(orderIdsInRoute);
  };

  const handleInProcessOrderInRoute = () => {
    // check if the driver has an in process order
    if (
      ordersInRoute &&
      Object.keys(ordersInRoute).length > 0 &&
      driver.currentInProcessOrder &&
      driver.currentInProcessOrder.id
    ) {
      //if the in process order is in the route, set it to the active leg
      if (Object.keys(ordersInRoute).includes(driver.currentInProcessOrder.id.toString())) {
        setCurrentInProcessOrderInActiveRoute(true);
        setCurrentlyActiveRouteLegIndex(
          driver.currentRoute?.legs.findIndex(
            (leg: any) => driver.currentInProcessOrder && leg.legOrder === ordersInRoute[driver.currentInProcessOrder.id]
          )
        );
      } else {
        setCurrentInProcessOrderInActiveRoute(false);
        setCurrentlyActiveRouteLegIndex(undefined);
      }
    } else {
      setCurrentInProcessOrderInActiveRoute(false);
    }
  };

  useEffect(() => {
    if (dspr && dspr.numberOrdersPerRoute) setNumberOrdersPerRoute();
    if (driver && driver.currentRoute) {
      if (!driver.currentRoute.active) {
        //if no active route, reset local state
        setOverviewPolyline(undefined);
        setOrderPolyline(undefined);
        setCurrentInProcessOrderInActiveRoute(false);
        setCurrentlyActiveRouteLegIndex(undefined);
      } else {
        //if route is active
        if (driver.currentRoute.overviewPolyline) {
          setOverviewPolyline(driver.currentRoute.overviewPolyline);
        }
        createOrdersInRoute();
        handleInProcessOrderInRoute();
      }
    }
    return;
  }, [dspr, driver]);

  const createOrderPolyline = () => {
    if (driver.currentRoute && driver.currentRoute.legs) {
      const legPolyline = [];
      const legDirectionPolylines = driver.currentRoute.legs[
        currentlyActiveRouteLegIndex
      ].routeLegDirections.map((routeLegDirection: any) => routeLegDirection.overviewPolyline);
      const finishedArray = legPolyline.concat(...legDirectionPolylines);
      setOrderPolyline(finishedArray);
      setOrderPolyline(finishedArray);
    }
  };

  useEffect(() => {
    if (
      currentlyActiveRouteLegIndex !== undefined &&
      driver &&
      driver.currentRoute &&
      driver.currentRoute.active &&
      driver.currentRoute.legs &&
      driver.currentRoute.legs.length &&
      driver.currentRoute.legs.includes(currentlyActiveRouteLegIndex)
    ) {
      createOrderPolyline();
    } else {
      setOrderPolyline(null);
    }
  }, [driver, currentlyActiveRouteLegIndex]);

  return (
    <RoutingMainDisplay
      createDSPRDriverRoute={createDSPRDriverRoute}
      isLoading={isLoading}
      orderIdsInRoute={orderIdsInRoute}
      activeRoute={activeRoute}
      navigation={navigation}
      driver={driver}
      routeView={routeView}
      setRouteView={setRouteView}
      orderPolyline={orderPolyline}
      overviewPolyline={overviewPolyline}
      currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
      currentInProcessOrderInActiveRoute={currentInProcessOrderInActiveRoute}
      orderSelectionModalOpen={orderSelectionModalOpen}
      setOrderSelectionModalOpen={setOrderSelectionModalOpen}
      maxOrdersPerRoute={maxOrdersPerRoute}
      removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
      deactivateDriverRoute={deactivateDriverRoute}
      markOrderInProcess={markOrderInProcess}
      cancelOrder={cancelOrder}
      completeOrder={completeOrder}
      progressDSPRDriverRoute={progressDSPRDriverRoute}
      isScanningDSPR={!!isScanningDSPR}
      isScanningComplete={!!isScanningComplete}
    />
  );
};

const mapStateToProps = (state) => {
  const dsprDriverIdForOrderDetails = state.api.dsprDriverId;
  const driver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: dsprDriverIdForOrderDetails,
  });
  const dspr = driver ? getDSPRFromProps(state, { dsprId: driver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  const driverRoutes = getRoutes(state);
  const activeRoute =
    driverRoutes && Object.values(driverRoutes).filter((route) => route.active)[0];
  const routeLegs = Object.values(getRouteLegs(state));
  const activeRouteLegs =
    activeRoute && routeLegs && routeLegs.filter((leg) => activeRoute.legs.includes(leg.id));
  const orderIdsInRoute = activeRouteLegs && activeRouteLegs.map((leg) => leg.order);
  return {
    dspr,
    driver,
    isLoading,
    orderIdsInRoute,
    activeRoute,
  };
};

const mapDispatchToProps = {
  createDSPRDriverRoute,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
  markOrderInProcess,
  cancelOrder,
  completeOrder,
  progressDSPRDriverRoute,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutingScreen);
