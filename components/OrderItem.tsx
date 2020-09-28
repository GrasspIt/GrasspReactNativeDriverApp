import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { markOrderInProcess } from '../actions/orderActions';

const OrderItem = ({ orderInfo, navigation }) => {
  const dispatch = useDispatch();

  const handleProcessOrder = () => {
    dispatch(markOrderInProcess(orderInfo.id));
  };

  const handleNavigate = () => {
    navigation.navigate('Details', { orderId: orderInfo.id });
  };

  return (
    orderInfo && (
      <ListItem bottomDivider onPress={handleNavigate}>
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
        <ListItem.Content>
          <ListItem.Title>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <ListItem.Subtitle>
            {orderInfo.address.street} {orderInfo.address.zipCode}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron color={Colors.medium} size={18} />
      </ListItem>
    )
  );
};

const styles = StyleSheet.create({});

export default OrderItem;
