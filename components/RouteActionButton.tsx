import React from 'react';
import { View, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { completeOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';
import { progressDSPRDriverRoute } from '../actions/driverActions';

const RouteActionButton = ({ driver, currentInProcessOrderInActiveRoute, ordersForRoute }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleProgressRoute = (routeId) => {
    dispatch(progressDSPRDriverRoute(routeId));
  };

  const handleCompleteOrder = (orderId) => {
    if (driver && driver.currentRoute) {
      dispatch(completeOrder(orderId));
    }
  };

  const confirmCompleteOrder = (orderId) => {
    Alert.alert('Complete Order', 'Are you sure you want to complete this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => handleCompleteOrder(orderId),
      },
    ]);
  };
  // determine whether to complete order or progress route
  const handleRouteActionButtonPressed = () => {
    if (driver && ordersForRoute) {
      if (driver.currentInProcessOrder) {
        if (!ordersForRoute.includes(driver.currentInProcessOrder)) {
          Alert.alert(
            'Warning',
            'You currently have an in-process order that is not part of the route. Would you like to complete this order before continuing route?',
            [
              {
                text: 'Complete Order and Continue',
                onPress: () => confirmCompleteOrder(driver.currentInProcessOrder.id),
              },
              {
                text: 'Continue Without Completing',
                style: 'cancel',
                onPress: () => handleProgressRoute(driver.currentRoute.id),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          confirmCompleteOrder(driver.currentInProcessOrder.id);
        }
      } else {
        dispatch(progressDSPRDriverRoute(driver.currentRoute.id));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', bottom: 0, backgroundColor: colors.background }}>
      <Button
        icon={!currentInProcessOrderInActiveRoute ? 'autorenew' : 'check'}
        mode='contained'
        style={{
          flex: 1,
          borderRadius: 0,
        }}
        labelStyle={{ paddingVertical: 4, color: colors.background }}
        onPress={() => handleRouteActionButtonPressed()}
      >
        {!currentInProcessOrderInActiveRoute ? 'Begin Next Leg' : 'Complete Order'}
      </Button>
    </View>
  );
};

export default RouteActionButton;
