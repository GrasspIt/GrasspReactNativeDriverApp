import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';

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
import { getDSPRDriverWithUserAndOrdersFromProps } from '../selectors/dsprDriverSelector';
import { createDSPRDriverRoute, progressDSPRDriverRoute } from '../actions/driverActions';

import DriverRoutePage from '../components/DriverRoutePage';
import RoutingButtons from '../components/RoutingButtons';
import Colors from '../constants/Colors';

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
  createDSPRDriverRoute: any;
  progressDSPRDriverRoute: any;
  handleMapOrderClick: (order: any) => any;
};

const RoutingScreen = ({
  navigation,
  driver,
  dspr,
  completeOrder,
  dsprDriverIdForOrderDetails,
  handleMapOrderClick,
  createDSPRDriverRoute,
  progressDSPRDriverRoute,
}: Props) => {
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

  const progressRoute = (routeId: number) => {
    progressDSPRDriverRoute(routeId);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <DriverRoutePage
          driver={driver}
          dspr={dspr}
          createRoute={createNewRoute}
          handleMapOrderClick={handleMapOrderClick}
          completeOrder={completeOrder}
          progressRoute={progressRoute}
          dsprDriverIdForOrderDetails={dsprDriverIdForOrderDetails}
        />
      </View>
      {/* <RoutingButtons /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const mapStateToProps = (state) => {
  const dsprDriverIdForOrderDetails = state.api.dsprDriverId;
  const driver = getDSPRDriverWithUserAndOrdersFromProps(state, {
    dsprDriverId: dsprDriverIdForOrderDetails,
  });
  const dspr = driver ? getDSPRFromProps(state, { dsprId: driver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  const error = state.api.errorMessage;
  return {
    dsprDriverIdForOrderDetails,
    dspr,
    driver,
    isLoading,
    error,
  };
};

const mapDispatchToProps = { createDSPRDriverRoute, progressDSPRDriverRoute };

export default connect(mapStateToProps, mapDispatchToProps)(RoutingScreen);
