import React from 'react';
import { Alert, Text, Platform } from 'react-native';
import { formatPhone } from '../utils/util';
import * as Linking from 'expo-linking';
import { useTheme, Card, Button } from 'react-native-paper';

const InProcessOrderItem = ({ orderInfo, navigation }) => {
  const { colors } = useTheme();

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
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    orderInfo && (
      <Card
        style={{ marginHorizontal: 10 }}
        onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      >
        <Card.Content>
          <Text style={{ fontSize: 18, paddingLeft: 16, paddingBottom: 4 }}>
            {orderInfo.user.firstName} {orderInfo.user.lastName},
          </Text>
          <Button
            mode='text'
            onPress={handleMap}
            uppercase={false}
            color='#0000EE'
            labelStyle={{ fontSize: 16 }}
            style={{ alignSelf: 'flex-start' }}
          >
            {orderInfo.address.street} {orderInfo.address.zipCode}
          </Button>
          <Button
            mode='text'
            onPress={handlePhone}
            color='#0000EE'
            labelStyle={{ fontSize: 16 }}
            style={{ alignSelf: 'flex-start' }}
          >
            {formatPhone(orderInfo.user.phoneNumber)}
          </Button>
        </Card.Content>
      </Card>
    )
  );
};

export default InProcessOrderItem;
