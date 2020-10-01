import React from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { markOrderInProcess } from '../actions/orderActions';

const OrderItem = ({ orderInfo, navigation }) => {
  const dispatch = useDispatch();

  const handleProcessOrder = () => {
    Alert.alert('Process Order', 'Are you sure you want to set this order in-process?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(markOrderInProcess(orderInfo.id)) },
    ]);
  };

  return (
    orderInfo && (
      <ListItem
        bottomDivider
        containerStyle={{ padding: 2 }}
        onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      >
        <Button
          title="Set In Process"
          titleStyle={{ fontSize: 14 }}
          buttonStyle={{
            width: 80,
            height: 60,
            borderRadius: 0,
            backgroundColor: Colors.primary,
          }}
          containerStyle={{ borderRadius: 0 }}
          onPress={handleProcessOrder}
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 16 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontSize: 14 }}>
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
