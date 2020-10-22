import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, orderStatus }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

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
    <View
      style={{
        backgroundColor: colors.surface,
        flexDirection: 'row',
        bottom: 0,
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
    margin: 0,
    borderRadius: 0,
  },
});

export default OrderButtons;
