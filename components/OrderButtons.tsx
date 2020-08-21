import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { completeOrder, cancelOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, navigation }) => {
  const dispatch = useDispatch();

  const handleCancelOrder = () => {
    const cancelAndReturn = () => {
      dispatch(cancelOrder(orderId));
      navigation.goBack();
    };
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => cancelAndReturn() },
    ]);
  };

  const handleCompleteOrder = () => {
    const completeAndReturn = () => {
      dispatch(completeOrder(orderId));
      navigation.goBack();
    };
    Alert.alert('Complete Order', 'Complete this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => completeAndReturn() },
    ]);
  };

  return (
    <View style={styles.buttonContainer}>
      <Button title="Cancel Order" onPress={handleCancelOrder} />
      <Button title="Complete Order" onPress={handleCompleteOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    padding: 10,
  },
});

export default OrderButtons;
