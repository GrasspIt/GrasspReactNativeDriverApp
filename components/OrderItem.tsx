import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { markOrderInProcess, MARK_IN_PROCESS_FAILURE } from '../actions/orderActions';

const OrderItem = ({ orderInfo, navigation }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcessOrder = () => {
    setIsLoading(true);
    dispatch<any>(markOrderInProcess(orderInfo.id)).then((response) => {
      if (response.type === MARK_IN_PROCESS_FAILURE) {
        setError(response.error);
        Alert.alert('Failed to set order in process. Try again.');
      }
      setIsLoading(false);
    });
  };

  const handleNavigate = () => {
    navigation.navigate('Details', { orderInfo });
  };

  return orderInfo ? (
    <ListItem bottomDivider onPress={handleNavigate}>
      {isLoading ? (
        <Button
          loading
          buttonStyle={{
            width: 80,
            height: 60,
            backgroundColor: Colors.primary,
          }}
        />
      ) : (
        <Button
          disabled={orderInfo.orderStatus == 'in_process'}
          disabledStyle={{ backgroundColor: Colors.light }}
          title="Set In Process"
          titleStyle={{ fontSize: 16 }}
          buttonStyle={{
            width: 80,
            height: 60,
            backgroundColor: Colors.primary,
          }}
          onPress={handleProcessOrder}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>
          {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
          <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>
          {orderInfo.address.street} {orderInfo.address.zipCode}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  ) : null;
};

const styles = StyleSheet.create({});

export default OrderItem;
