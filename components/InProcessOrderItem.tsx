import React from 'react';
import { ListItem, Button } from 'react-native-elements';
import { Alert, Text, Platform } from 'react-native';
import { formatPhone } from '../hooks/util';
import * as Linking from 'expo-linking';

const InProcessOrderItem = ({ orderInfo, navigation }) => {
  const handleNavigate = () => {
    navigation.navigate('Details', { orderId: orderInfo.id });
  };

  const handleMap = () => {
    let daddr = encodeURIComponent(`${orderInfo.address.street} ${orderInfo.address.zipCode}`);
    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
    }
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
      <ListItem onPress={handleNavigate}>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, paddingLeft: 10, paddingBottom: 2 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
            <Text style={{ fontSize: 16 }}>${orderInfo.cashTotal}</Text>
          </ListItem.Title>
          <Button
            type="clear"
            title={`${orderInfo.address.street} ${orderInfo.address.zipCode}`}
            titleStyle={{ fontSize: 16 }}
            buttonStyle={{ padding: 2, paddingLeft: 10 }}
            onPress={handleMap}
          />
          <Button
            type="clear"
            title={formatPhone(orderInfo.user.phoneNumber)}
            titleStyle={{ fontSize: 16 }}
            buttonStyle={{ padding: 2, paddingLeft: 10 }}
            onPress={handlePhone}
          />
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  );
};

export default InProcessOrderItem;
