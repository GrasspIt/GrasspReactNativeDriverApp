import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { useDispatch } from 'react-redux';
import { removeOrderAndRefreshRoute } from '../actions/driverActions';

const OrderButtons = ({ orderId, orderStatus, orderIdsInRoute, activeRoute }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(cancelOrder(orderId)) },
    ]);
  };

  const handleRemoveFromRoute = () => {
    let orderIdsInNewRoute = orderIdsInRoute
      .filter((id) => id !== orderId)
      .map((orderId) => ({
        id: orderId,
      }));
    let finalOrderInNewRouteId = orderIdsInNewRoute[orderIdsInNewRoute.length - 1];
    console.log('orderIdsInNewRoute', orderIdsInNewRoute);
    console.log('finalOrderInNewRouteId', finalOrderInNewRouteId);
    console.log('activeRoute.id', activeRoute.id);
    console.log('activeRoute.dsprDriver', activeRoute.dsprDriver);
    Alert.alert(
      'Remove From Route',
      'Are you sure you want to remove this order from the current route?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () =>
            dispatch(
              removeOrderAndRefreshRoute(
                activeRoute.id,
                activeRoute.dsprDriver,
                orderIdsInNewRoute,
                finalOrderInNewRouteId,
                false
              )
            ),
        },
      ]
    );
  };

  const handleCompleteOrder = () => {
    Alert.alert('Complete Order', 'Are you ready to complete this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(completeOrder(orderId)) },
    ]);
  };

  const handleProcessOrder = () => {
    Alert.alert('Process Order', 'Mark this order as in-process?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(markOrderInProcess(orderId)) },
    ]);
  };

  return (
    <View>
      <Button
        icon='cancel'
        mode='contained'
        color={colors.error}
        style={styles.buttons}
        labelStyle={{ paddingVertical: 4, color: colors.surface }}
        onPress={handleCancelOrder}
      >
        Cancel Order
      </Button>

      {orderIdsInRoute && orderIdsInRoute.includes(orderId) && (
        <Button
          icon='map-minus'
          mode='contained'
          color={colors.error}
          style={styles.buttons}
          labelStyle={{ paddingVertical: 4, color: colors.surface }}
          onPress={handleRemoveFromRoute}
        >
          Remove from Route
        </Button>
      )}

      {orderStatus == 'in_process' ? (
        <Button
          icon='check'
          mode='contained'
          color={colors.primary}
          style={styles.buttons}
          labelStyle={{ paddingVertical: 4, color: colors.surface }}
          onPress={handleCompleteOrder}
        >
          Complete Order
        </Button>
      ) : (
        <Button
          mode='contained'
          icon='autorenew'
          color={colors.primary}
          style={styles.buttons}
          labelStyle={{ paddingVertical: 4, color: colors.surface }}
          onPress={handleProcessOrder}
        >
          Set In Process
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 50,
    elevation: 2,
  },
});

export default OrderButtons;
