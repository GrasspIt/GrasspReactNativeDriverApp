import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { markOrderInProcess } from '../actions/orderActions';

const OrderItem = ({ orderInfo, navigation }) => {
  const dispatch = useDispatch();

  const handleProcessOrder = () => {
    dispatch(markOrderInProcess(orderInfo.id));
  };

  const handleNavigate = () => {
    navigation.navigate('Details', { order: orderInfo });
  };

  return orderInfo ? (
    <ListItem bottomDivider onPress={handleNavigate}>
      {orderInfo.orderStatus == 'in_process' ? (
        <Text style={styles.inProcess}>Order In Process</Text>
      ) : (
        <Button
          title="Set In Process"
          titleStyle={{ fontSize: 16 }}
          buttonStyle={{
            width: 80,
            height: 70,
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

const styles = StyleSheet.create({
  inProcess: {
    width: 80,
    color: Colors.primary,
    fontSize: 16,
    paddingLeft: 4,
  },
});

export default OrderItem;
