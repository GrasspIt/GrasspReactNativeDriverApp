import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDispatch } from 'react-redux';
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
  RouteMetrics,
  RouteLegDirection,
} from '../store/reduxStoreState';
import { createDSPRDriverRoute, progressDSPRDriverRoute } from '../actions/driverActions';
import TopNavBar from '../components/TopNavBar';
import RoutingButtons from '../components/RoutingButtons';
// import DriverRoutePage from '../components/DriverRoutePage';

type RoutingScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Routing'>;
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
          overviewPolyline: google.maps.LatLng[];
        }[];
    };
    serviceAreas?: DSPRDriverServiceArea[];
  };
  completeOrder: (orderId: number) => any;
  dspr: DSPR;
  modifyOrder: any;
  loggedInUserIsDriver: boolean;
  dsprDriverIdForOrderDetails: number;
  handleMapOrderClick: (order: any) => any;
};

const RoutingScreen = ({
  navigation,
  driver,
  dspr,
  completeOrder,
  loggedInUserIsDriver,
  dsprDriverIdForOrderDetails,
  handleMapOrderClick,
}: Props) => {
  const dispatch = useDispatch();

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
    return dispatch(
      createDSPRDriverRoute(driverId, orderIds, finalDestination, usingFinalDestinationInRoute)
    );
  };

  const progressRoute = (routeId: number) => {
    return dispatch(progressDSPRDriverRoute(routeId));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <DriverRoutePage
      driver={driver}
      dspr={dspr}
      createRoute={createNewRoute}
      handleMapOrderClick={handleMapOrderClick}
      completeOrder={completeOrder}
      progressRoute={progressRoute}
      loggedInUserIsDriver={loggedInUserIsDriver}
      dsprDriverIdForOrderDetails={dsprDriverIdForOrderDetails}
    /> */}
        <MapView style={styles.mapStyle} />
      </View>
      <RoutingButtons />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default RoutingScreen;
