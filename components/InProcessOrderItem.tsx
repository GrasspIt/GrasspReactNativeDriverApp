import React from 'react';
import { ListItem } from 'react-native-elements';
import { Text } from 'react-native';
import { formatPhone } from '../hooks/util';

const InProcessOrderItem = ({ orderInfo, navigation }) => {
  const handleNavigate = () => {
    navigation.navigate('Details', { order: orderInfo });
  };
  return (
    orderInfo && (
      <ListItem style={{ paddingLeft: 10 }} onPress={handleNavigate}>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 16 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontSize: 16, paddingVertical: 6 }}>
            {orderInfo.address.street} {orderInfo.address.zipCode}
          </ListItem.Subtitle>
          {orderInfo.orderStatus == 'in_process' ? (
            <ListItem.Subtitle style={{ fontSize: 16 }}>
              {formatPhone(orderInfo.user.phoneNumber)}
            </ListItem.Subtitle>
          ) : null}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  );
};

export default InProcessOrderItem;
