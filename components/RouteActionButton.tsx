import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';

interface RouteActionButtonProps {
  isLoading: boolean;
  driver;
  currentInProcessOrderInActiveRoute;
  ordersForRoute;
  orderIdsInRoute;
  progressDSPRDriverRoute;
  completeOrder;
  isScanningDSPR: boolean;
  isScanningComplete: boolean;
}

const RouteActionButton = ({
  isLoading,
  driver,
  currentInProcessOrderInActiveRoute,
  ordersForRoute,
  orderIdsInRoute,
  progressDSPRDriverRoute,
  completeOrder,
  isScanningDSPR,
  isScanningComplete,
}: RouteActionButtonProps) => {
  const { colors } = useTheme();

  const handleProgressRoute = (routeId) => {
    progressDSPRDriverRoute(routeId);
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
      completeOrder(orderId);
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
        if (!orderIdsInRoute.includes(driver.currentInProcessOrder.id)) {
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

  /**Disable FAB if component is loading
   * -> if there is a current in process order, and the dspr requires order to be scanned,
   *      disable the FAB if scanning is incomplete
   *
   * -> if this FAB was not disabled, the driver could tap 'Next Leg' (and complete order) or 'Complete Order'. The backend
   *      would not completed this order, however, as all the order details have not been scanned. Disabling the button allows the
   *      driver to avoid this error message
   * */
  const determineIfFABIsDisabled = (): boolean => {
    if (isLoading) {
      return true;
    }

    if (isScanningDSPR) {
      if(currentInProcessOrderInActiveRoute) {
        return !isScanningComplete
      }
    }

    return false;
  }

  const isFABDisabled: boolean = determineIfFABIsDisabled();

  return (
    <FAB
      disabled={isFABDisabled}
      style={styles.fab}
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
