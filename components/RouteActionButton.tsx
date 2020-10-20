import React from 'react';
import { View, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { completeOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';
import { COMPLETE_ORDER_SUCCESS } from '../actions/orderActions';
import { progressDSPRDriverRoute } from '../actions/driverActions';

const RouteActionButton = ({
  driver,
  currentInProcessOrderInActiveRoute,
  ordersCurrentlyInRoute,
}) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleCompleteOrder = (orderId) => {
    Alert.alert('Complete Order', 'Are you ready to complete this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () =>
          dispatch(completeOrder(orderId)).then((response) => {
            if (response.type === COMPLETE_ORDER_SUCCESS) {
              dispatch(progressDSPRDriverRoute(driver.currentRoute.id));
            }
          }),
      },
    ]);
  };

  const handleCompleteInProcessOrder = () => {
    if (driver && driver.currentInProcessOrder) {
      handleCompleteOrder(driver.currentInProcessOrder.id);
    }
  };

  // determine whether to complete order or progress route
  const handleRouteActionButtonPressed = () => {
    if (driver && ordersCurrentlyInRoute) {
      if (driver.currentInProcessOrder) {
        if (
          !Object.keys(ordersCurrentlyInRoute).includes(driver.currentInProcessOrder.id.toString())
        ) {
          Alert.alert(
            'Warning',
            'You currently have an in-process order that is not part of the route. Would you like to mark this order as complete and continue with your route?',
            [
              {
                text: 'No',
                style: 'cancel',
                onPress: () => dispatch(progressDSPRDriverRoute(driver.currentRoute.id)),
              },
              { text: 'Yes', onPress: handleCompleteInProcessOrder },
            ]
          );
        } else {
          handleCompleteOrder(driver.currentInProcessOrder.id);
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
