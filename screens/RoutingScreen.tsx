import React from 'react';
import { View, SafeAreaView } from 'react-native';
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
import { createDSPRDriverRoute } from '../actions/driverActions';
import { useTheme } from 'react-native-paper';
import DriverRoutePage from '../components/DriverRoutePage';
import TopNavBar from '../components/TopNavBar';

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <TopNavBar title='Routing' navigation={navigation} />
        <DriverRoutePage driver={driver} dspr={dspr} createRoute={createNewRoute} />
      </View>
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
