import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import OrderItemBasic from './OrderItemBasic';
import Colors from '../constants/Colors';

const OrderSelectionModal = ({
  orderSelectionModalOpen,
  setOrderSelectionModalOpen,
  ordersForRoute,
  numberOrdersPerRoute,
  driver,
  routeError,
  routeButtonDisabled,
  handleRouteCreationSubmission,
}) => {
  return (
    <Dialog visible={orderSelectionModalOpen} onDismiss={() => setOrderSelectionModalOpen(false)}>
      <Dialog.Title>Order Selection</Dialog.Title>
      {routeError ? <Text>{routeError}</Text> : null}
      <Dialog.Content>
        <Text style={styles.listTitle}>
          Selected Orders: {ordersForRoute.length || 0}/{numberOrdersPerRoute}
        </Text>
        <Divider />
        {driver && driver.currentInProcessOrder && (
          <>
            <Text style={styles.listTitle}>In Process Order</Text>
            <Divider />
            <OrderItemBasic orderInfo={driver.currentInProcessOrder} />
          </>
        )}
        {driver && driver.queuedOrders && driver.queuedOrders.length > 0 && (
          <>
            <Text style={styles.listTitle}>Queued Orders</Text>
            <Divider />
            <FlatList
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text>No orders.</Text>
                </View>
              }
              data={driver.queuedOrders}
              renderItem={(item) => <OrderItemBasic orderInfo={item.item} />}
              keyExtractor={(item: any) => item.id.toString()}
              style={styles.orders}
            />
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button mode="text" onPress={() => setOrderSelectionModalOpen(false)}>
          Cancel
        </Button>
        <Button
          mode="contained"
          labelStyle={{ color: Colors.light }}
          disabled={routeButtonDisabled}
          onPress={() => handleRouteCreationSubmission()}
        >
          Create Route
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  orders: {
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
});

export default OrderSelectionModal;
