import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import { completeOrder, cancelOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, navigation }) => {
  const dispatch = useDispatch();

  const cancelAndReturn = () => {
    dispatch(cancelOrder(orderId));
    navigation.goBack();
  };

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => cancelAndReturn() },
    ]);
  };

  const completeAndReturn = () => {
    dispatch(completeOrder(orderId));
    navigation.goBack();
  };

  const handleCompleteOrder = () => {
    Alert.alert('Complete Order', 'Complete this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => completeAndReturn() },
    ]);
  };

  return (
    <View style={styles.buttonContainer}>
      <Button
        title="Cancel Order"
        containerStyle={styles.buttons}
        buttonStyle={{ backgroundColor: Colors.primary }}
        onPress={handleCancelOrder}
      />
      <Button
        title="Complete Order"
        containerStyle={styles.buttons}
        buttonStyle={{ backgroundColor: Colors.primary }}
        onPress={handleCompleteOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
  },
  buttons: {
    flex: 1,
    margin: 8,
  },
});

export default OrderButtons;
