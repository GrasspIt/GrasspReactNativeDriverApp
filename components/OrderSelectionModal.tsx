import React from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import OrderItemBasic from './OrderItemBasic';

const OrderSelectionModal = ({
  orderSelectionModalOpen,
  setOrderSelectionModalOpen,
  ordersForRoute,
  maxOrdersPerRoute,
  driver,
  confirmCreateRoute,
}) => {
  const { colors } = useTheme();
  return (
    <Modal
      animationType='slide'
      visible={orderSelectionModalOpen}
      onRequestClose={() => setOrderSelectionModalOpen(false)}
    >
      <Dialog.Title>Order Selection</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.listTitle}>
          Selected Orders: {(ordersForRoute && ordersForRoute.length) || 0}/{maxOrdersPerRoute}
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
              style={{ height: '50%' }}
              ListEmptyComponent={
                <View style={[styles.empty, { backgroundColor: colors.background }]}>
                  <Text>No orders.</Text>
                </View>
              }
              data={driver.queuedOrders}
              renderItem={(item) => <OrderItemBasic orderInfo={item.item} />}
              keyExtractor={(item: any) => item.id.toString()}
            />
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button mode='text' onPress={() => setOrderSelectionModalOpen(false)}>
          Cancel
        </Button>
        <Button
          mode='contained'
          labelStyle={{ color: colors.background }}
          onPress={() => confirmCreateRoute()}
        >
          Create Route
        </Button>
      </Dialog.Actions>
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
});

export default OrderSelectionModal;
