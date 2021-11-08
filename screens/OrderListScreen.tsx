import React, { useState } from 'react';
import {
  refreshDSPRDriver,
  getDSPRDriver,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
} from '../actions/driverActions';
import { markOrderInProcess, cancelOrder } from '../actions/orderActions';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';
import { connect } from 'react-redux';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import OrderMainDisplay from "../components/OrderMainDisplay";
import { SetViewOptions } from "../components/RouteAndOrderViewButtons";

type OrderListScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Orders'>;
type Props = {
  navigation: OrderListScreenNavigationProp;
  driverId;
  loggedInUser;
  dsprDriver;
  isLoading;
  refreshDSPRDriver;
  getDSPRDriver;
  removeOrderAndRefreshRoute;
  deactivateDriverRoute;
  markOrderInProcess;
  cancelOrder;
};

const OrderListScreen = ({
  navigation,
  driverId,
  loggedInUser,
  dsprDriver,
  isLoading,
  getDSPRDriver,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
  markOrderInProcess,
  cancelOrder,
}: Props) => {
  const [orderView, setOrderView] = useState<SetViewOptions>('map');

  const getDriverData = () => {
    if (loggedInUser) getDSPRDriver(driverId);
  };

  return loggedInUser && dsprDriver ? (
    <OrderMainDisplay
      navigation={navigation}
      dsprDriver={dsprDriver}
      isLoading={isLoading}
      getDriverData={getDriverData}
      removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
      deactivateDriverRoute={deactivateDriverRoute}
      markOrderInProcess={markOrderInProcess}
      cancelOrder={cancelOrder}
      orderView={orderView}
      setOrderView={setOrderView}
    />
  ) : null;
};

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: driverId,
  });
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
    dsprDriver,
    isLoading,
  };
};

const mapDispatchToProps = {
  refreshDSPRDriver,
  getDSPRDriver,
  removeOrderAndRefreshRoute,
  deactivateDriverRoute,
  markOrderInProcess,
  cancelOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderListScreen);
