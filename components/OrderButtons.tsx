import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Colors from '../constants/Colors';
import { completeOrder, cancelOrder } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const OrderButtons = ({ orderId, navigation, orderStatus }) => {
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

  return (
    <>
      {orderStatus == 'in_process' ? (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{ color: Colors.light }}
            onPress={handleCancelOrder}
          >
            Cancel Order
          </Button>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{ color: Colors.light }}
            onPress={handleCompleteOrder}
          >
            Complete Order
          </Button>
        </View>
      ) : (
        <View style={{ padding: 5, backgroundColor: Colors.light }}>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{ color: Colors.light }}
            onPress={handleCancelOrder}
          >
            Cancel Order
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    bottom: 0,
  },
});

export default OrderButtons;
