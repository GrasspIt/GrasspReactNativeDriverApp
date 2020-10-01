import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Colors from '../constants/Colors';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, orderStatus }) => {
  const dispatch = useDispatch();

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
    <View style={styles.buttonContainer}>
      <Button
        icon="cancel"
        mode="contained"
        color={Colors.red}
        style={styles.buttons}
        labelStyle={{ color: Colors.light }}
        onPress={handleCancelOrder}
      >
        Cancel Order
      </Button>
      {orderStatus == 'in_process' ? (
        <Button
          icon="check"
          mode="contained"
          color={Colors.primary}
          style={styles.buttons}
          labelStyle={{ color: Colors.light }}
          onPress={handleCompleteOrder}
        >
          Complete Order
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="autorenew"
          color={Colors.primary}
          style={styles.buttons}
          labelStyle={{ color: Colors.light }}
          onPress={handleProcessOrder}
        >
          Set In Process
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    bottom: 0,
  },
  buttons: {
    flex: 1,
    borderRadius: 0,
  },
});

export default OrderButtons;
