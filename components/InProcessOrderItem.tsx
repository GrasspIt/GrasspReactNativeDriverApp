import React from 'react';
import { ListItem } from 'react-native-elements';
import { Alert, Text } from 'react-native';
import { formatPhone } from '../hooks/util';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

const InProcessOrderItem = ({ orderInfo, navigation }) => {
  const handleNavigate = () => {
    navigation.navigate('Details', { order: orderInfo });
  };

  const handlePhone = () => {
    Alert.alert(
      'Contact Customer',
      `How would you like to contact ${formatPhone(orderInfo.user.phoneNumber)}`,
      [
        { text: 'Call', onPress: () => Linking.openURL(`tel:${orderInfo.user.phoneNumber}`) },
        { text: 'Text', onPress: () => Linking.openURL(`sms:${orderInfo.user.phoneNumber}`) },
      ]
    );
  };

  return (
    orderInfo && (
      <ListItem style={{ paddingLeft: 10 }}>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 16 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <TouchableOpacity>
            <ListItem.Subtitle style={{ fontSize: 16, paddingVertical: 6, color: 'blue' }}>
              {orderInfo.address.street} {orderInfo.address.zipCode}
            </ListItem.Subtitle>
          </TouchableOpacity>
          {orderInfo.orderStatus == 'in_process' ? (
            <TouchableOpacity onPress={handlePhone}>
              <ListItem.Subtitle style={{ fontSize: 16, color: 'blue' }}>
                {formatPhone(orderInfo.user.phoneNumber)}
              </ListItem.Subtitle>
            </TouchableOpacity>
          ) : null}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  );
};

export default InProcessOrderItem;
