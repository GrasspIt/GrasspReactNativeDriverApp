import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, useTheme, FAB, Portal } from 'react-native-paper';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, orderStatus }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [buttonsOpen, setButtonsOpen] = useState(false);

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(cancelOrder(orderId)) },
    ]);
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
    <>
      <Portal>
        <FAB.Group
          open={buttonsOpen}
          visible
          icon='format-list-bulleted'
          actions={[
            {
              icon: 'cancel',
              label: 'Cancel Order',
              color: colors.surface,
              style: { backgroundColor: colors.error },
              onPress: handleCancelOrder,
            },
            {
              icon: 'map-minus',
              label: 'Remove From Route',
              color: colors.surface,
              style: { backgroundColor: colors.error },
              onPress: () => console.log('Remove from Route'),
            },
            {
              icon: 'check',
              label: 'Complete Order',
              color: colors.surface,
              style: { backgroundColor: colors.primary },
              onPress: handleCompleteOrder,
            },
          ]}
          onStateChange={() => setButtonsOpen(!buttonsOpen)}
          onPress={() => {
            if (buttonsOpen) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
      <View
        style={{
          backgroundColor: colors.surface,
          // flexDirection: 'row',
          // bottom: 0,
        }}
      >
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
        <Button
          icon='map-minus'
          mode='outlined'
          color={colors.error}
          style={styles.buttons}
          labelStyle={{ paddingVertical: 4, color: colors.error }}
          onPress={handleCancelOrder}
        >
          Remove from Route
        </Button>
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
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
});

export default OrderButtons;
