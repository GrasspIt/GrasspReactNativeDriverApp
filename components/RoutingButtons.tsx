import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Colors from '../constants/Colors';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const RoutingButtons = ({ orderId, navigation, orderStatus }) => {
  const dispatch = useDispatch();

  const cancelAndReturn = () => {
    dispatch(cancelOrder(orderId));
    navigation.navigate('Home');
  };

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => cancelAndReturn() },
    ]);
  };

  const completeAndReturn = () => {
    dispatch(completeOrder(orderId));
    navigation.navigate('Home');
  };

  const handleCompleteOrder = () => {
    Alert.alert('Complete Order', 'Are you ready to complete this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => completeAndReturn() },
    ]);
  };

  const processAndReturn = () => {
    dispatch(markOrderInProcess(orderId));
    navigation.navigate('Home');
  };

  const handleProcessOrder = () => {
    Alert.alert('Process Order', 'Mark this order as in-process?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => processAndReturn() },
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
          Start New Leg
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

export default RoutingButtons;