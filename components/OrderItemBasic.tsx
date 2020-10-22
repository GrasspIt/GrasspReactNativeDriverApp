import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const OrderItemBasic = ({ orderInfo }) => {
  return (
    orderInfo && (
      <ListItem bottomDivider containerStyle={{ padding: 10 }}>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 16 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontSize: 14 }}>
            {orderInfo.address.street} {orderInfo.address.zipCode}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )
  );
};

const styles = StyleSheet.create({});

export default OrderItemBasic;
