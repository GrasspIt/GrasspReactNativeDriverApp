import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Alert } from 'react-native';
import { Button, Dialog, useTheme, Divider, IconButton, FAB } from 'react-native-paper';
import OrderItemBasic from './OrderItemBasic';

const OrderSelectionModal = ({
  orderSelectionModalOpen,
  setOrderSelectionModalOpen,
  maxOrdersPerRoute,
  driver,
  createDSPRDriverRoute,
}) => {
  const { colors } = useTheme();

  //need a list of all orders to display, need a list of selected orders to highlight

  const [disableButton, setDisableButton] = useState(false);
  const [selectedOrdersForRoute, setSelectedOrdersForRoute] = useState<any>();
  const [finalOrderForRoute, setFinalOrderForRoute] = useState<any>();

  const handleSelectOrder = (orderId) => {
    //if item is included in selectedOrdersList, remove it
    //if not, and the maxOrders has been reached, notify the user, else add to list
    console.log('orderId', orderId);
  };

  // function to create a new route
  const createNewRoute = (driverId, waypoints, finalDestination, usingFinalDestinationInRoute) => {
    const orderIds = waypoints.map((order) => ({ id: order.id }));
    if (!finalDestination) {
      finalDestination = orderIds.pop();
      usingFinalDestinationInRoute = true;
    } else {
      finalDestination = { id: finalDestination.id };
    }
    createDSPRDriverRoute(driverId, orderIds, finalDestination, usingFinalDestinationInRoute);
  };

  // validate route creation
  const handleRouteCreation = () => {
    if (selectedOrdersForRoute.length === 0) {
      Alert.alert('A route must contain at least 1 order.');
      return;
    }
    createNewRoute(driver.id, selectedOrdersForRoute, finalOrderForRoute, false);
    setDisableButton(false);
    setOrderSelectionModalOpen(false);
  };

  // check if there is already an active route
  const confirmCreateRoute = () => {
    setDisableButton(true);
    if (driver && driver.currentRoute && driver.currentRoute.active) {
      Alert.alert(
        'Override Route?',
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => handleRouteCreation() },
        ]
      );
    } else {
      handleRouteCreation();
    }
  };

  useEffect(() => {
    // autofill in process order and all queued orders
    const allOrders =
      driver && driver.currentInProcessOrder && driver.queuedOrders
        ? [driver.currentInProcessOrder, ...driver.queuedOrders]
        : driver && driver.currentInProcessOrder
        ? [driver.currentInProcessOrder]
        : driver && driver.queuedOrders
        ? [...driver.queuedOrders]
        : [];

    // slice the array up to the max order length
    const autoFilledOrders = allOrders.slice(0, maxOrdersPerRoute);

    setFinalOrderForRoute(autoFilledOrders[autoFilledOrders.length - 1]);
    setSelectedOrdersForRoute(autoFilledOrders);
  }, [driver, maxOrdersPerRoute]);

  return (
    <Modal
      animationType='slide'
      visible={orderSelectionModalOpen}
      onRequestClose={() => setOrderSelectionModalOpen(false)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Dialog.Title>Order Selection</Dialog.Title>
        <IconButton icon='close' onPress={() => setOrderSelectionModalOpen(false)} />
      </View>
      <Dialog.Content>
        <Text style={styles.listTitle}>
          Selected Orders: {(selectedOrdersForRoute && selectedOrdersForRoute.length) || 0}/
          {maxOrdersPerRoute}
        </Text>
        <Divider />
        {driver && driver.currentInProcessOrder && (
          <>
            <Text style={styles.listTitle}>In Process Order</Text>
            <Divider />
            <OrderItemBasic
              selectedOrdersForRoute={selectedOrdersForRoute}
              handleSelectOrder={handleSelectOrder}
              orderInfo={driver.currentInProcessOrder}
            />
          </>
        )}
        {driver && driver.queuedOrders && driver.queuedOrders.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Queued Orders</Text>
            <Divider />
            <View style={{ flexGrow: 1 }}>
              <FlatList
                ListEmptyComponent={
                  <View style={[styles.empty, { backgroundColor: colors.background }]}>
                    <Text>No orders.</Text>
                  </View>
                }
                data={driver.queuedOrders}
                renderItem={(item) => (
                  <OrderItemBasic
                    selectedOrdersForRoute={selectedOrdersForRoute}
                    handleSelectOrder={handleSelectOrder}
                    orderInfo={item.item}
                  />
                )}
                contentContainerStyle={{ paddingBottom: 300 }}
                keyExtractor={(item: any) => item.id.toString()}
              />
            </View>
          </View>
        )}
      </Dialog.Content>
      <FAB
        label='Create Route'
        icon='check'
        disabled={disableButton}
        onPress={() => confirmCreateRoute()}
        style={styles.fab}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default OrderSelectionModal;
