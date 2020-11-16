import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import { completeOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';
import { progressDSPRDriverRoute } from '../actions/driverActions';

const RouteActionButton = ({ driver, currentInProcessOrderInActiveRoute, ordersForRoute }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleProgressRoute = (routeId) => {
    dispatch(progressDSPRDriverRoute(routeId));
  };

  const confirmProgressRoute = (routeId) => {
    Alert.alert('Progress Route', 'Are you sure you want to start the next leg?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => handleProgressRoute(routeId),
      },
    ]);
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
                onPress: () => confirmProgressRoute(driver.currentRoute.id),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          confirmCompleteOrder(driver.currentInProcessOrder.id);
        }
      } else {
        confirmProgressRoute(driver.currentRoute.id);
      }
    }
  };

  return (
    <FAB
      style={[styles.fab, { backgroundColor: colors.primary }]}
      color={colors.surface}
      label={!currentInProcessOrderInActiveRoute ? 'Begin Next Leg' : 'Complete Order'}
      icon={!currentInProcessOrderInActiveRoute ? 'autorenew' : 'check'}
      onPress={() => handleRouteActionButtonPressed()}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RouteActionButton;
