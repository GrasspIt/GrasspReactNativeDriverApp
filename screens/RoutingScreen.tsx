import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RoutingStackParamsList } from '../navigation/RoutingNavigator';
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
import {
  createDSPRDriverRoute,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
} from '../actions/driverActions';
import { markOrderInProcess, cancelOrder } from '../actions/orderActions';
import { getRouteLegs, getRoutes } from '../selectors/dsprDriverRouteSelectors';
import RoutingMainDisplay from '../components/RoutingMainDisplay';

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
  orderIdsInRoute;
  activeRoute;
  removeOrderAndRefreshRoute;
  deactivateDriverRoute;
  markOrderInProcess;
  cancelOrder;
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
          driver.currentInProcessOrder &&
          driver.currentInProcessOrder.id
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
      driver.currentRoute.legs &&
      driver.currentRoute.legs.length
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
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutingScreen);
