import React from 'react';
import { Text, Alert, View, StyleSheet } from 'react-native';
import { useTheme, Button, Card, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { markOrderInProcess, cancelOrder } from '../actions/orderActions';
import { removeOrderAndRefreshRoute, deactivateDriverRoute } from '../actions/driverActions';

const OrderItem = ({ orderInfo, navigation, ordersForRoute, orderIdsInRoute, activeRoute }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  let orderList = ordersForRoute && ordersForRoute.map((leg) => leg.order);

  const handleProcessOrder = () => {
    Alert.alert('Process Order', 'Are you sure you want to set this order in-process?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(markOrderInProcess(orderInfo.id)) },
    ]);
  };

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(cancelOrder(orderInfo.id)) },
    ]);
  };
  const removeFromRoute = (routeId, driverId, orderIds, finalOrderId, boolean) => {
    if (finalOrderId === null) {
      dispatch(deactivateDriverRoute(routeId));
      Alert.alert('Success!', 'Order removed from route.');
      return;
    }
    dispatch(removeOrderAndRefreshRoute(routeId, driverId, orderIds, finalOrderId, boolean));
    navigation.goBack();
  };

  const handleRemoveFromRoute = () => {
    let orderIdsInNewRoute = orderIdsInRoute
      .filter((id) => id !== orderInfo.id)
      .map((orderId) => ({
        id: orderId,
      }));
    let finalOrderInNewRouteId = orderIdsInNewRoute.length
      ? orderIdsInNewRoute.length > 1
        ? orderIdsInNewRoute[orderIdsInNewRoute.length - 1]
        : orderIdsInNewRoute[0]
      : null;
    Alert.alert(
      'Remove From Route',
      'Are you sure you want to remove this order from the current route?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () =>
            removeFromRoute(
              activeRoute.id,
              activeRoute.dsprDriver,
              orderIdsInNewRoute,
              finalOrderInNewRouteId,
              false
            ),
        },
      ]
    );
  };

  return (
    orderInfo && (
      <Card
        style={{ marginBottom: 10 }}
        onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      >
        <Card.Content style={styles.cardContent}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, paddingBottom: 4 }}>
                {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 4 }}>${orderInfo.cashTotal}</Text>
            </View>
            <Text style={{ fontSize: 16, paddingBottom: 8 }}>
              {orderInfo.address.street} {orderInfo.address.zipCode}{' '}
              {orderInfo.address.aptNumber && `, Unit ${orderInfo.address.aptNumber}`}
            </Text>
          </View>
          <IconButton
            icon='chevron-right'
            onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
          />
        </Card.Content>
        <Card.Actions style={{ padding: 0 }}>
          {orderList && orderList.includes(orderInfo) ? (
            <Button
              icon='map-minus'
              mode='contained'
              color={colors.error}
              style={styles.buttons}
              labelStyle={{ color: colors.surface }}
              onPress={handleRemoveFromRoute}
            >
              Remove From Route
            </Button>
          ) : (
            <Button
              icon='cancel'
              mode='contained'
              color={colors.error}
              style={styles.buttons}
              labelStyle={{ color: colors.surface }}
              onPress={handleCancelOrder}
            >
              Cancel Order
            </Button>
          )}
          <Button
            mode='contained'
            icon='autorenew'
            color={colors.primary}
            style={styles.buttons}
            labelStyle={{ color: colors.surface }}
            onPress={handleProcessOrder}
          >
            Set In Process
          </Button>
        </Card.Actions>
      </Card>
    )
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    elevation: 0,
    margin: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});

export default OrderItem;
