import React from 'react';
import { Alert, Text, Platform, View } from 'react-native';
import { formatPhone } from '../utils/util';
import * as Linking from 'expo-linking';
import { Card, Button, IconButton, useTheme, List } from 'react-native-paper';

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
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${orderInfo.user.phoneNumber}`) },
        { text: 'Text', onPress: () => Linking.openURL(`sms:${orderInfo.user.phoneNumber}`) },
      ]
    );
  };

  return (
    orderInfo && (
      <Card
        style={{ marginHorizontal: 10 }}
        onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      >
        <Card.Content
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <List.Item
              title={
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    paddingVertical: 0,
                    paddingLeft: 34,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
                  </Text>
                  <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
                </View>
              }
              style={{ paddingVertical: 0 }}
            />
            {orderInfo.address.aptNumber ? (
              <List.Item
                title={`${orderInfo.address.street}, ${orderInfo.address.zipCode}, Unit ${orderInfo.address.aptNumber}`}
                titleNumberOfLines={2}
                style={{ padding: 0 }}
                left={() => (
                  <IconButton icon='map' color={colors.primary} size={20} onPress={handleMap} />
                )}
              />
            ) : (
              <List.Item
                title={`${orderInfo.address.street}, ${orderInfo.address.zipCode}`}
                titleNumberOfLines={2}
                style={{ padding: 0 }}
                left={() => (
                  <IconButton icon='map' color={colors.primary} size={20} onPress={handleMap} />
                )}
              />
            )}
            <List.Item
              title={`${formatPhone(orderInfo.user.phoneNumber)}`}
              titleNumberOfLines={2}
              style={{ padding: 0 }}
              left={() => (
                <IconButton icon='phone' color={colors.primary} size={20} onPress={handlePhone} />
              )}
            />
          </View>
          <IconButton
            icon='chevron-right'
            onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
          />
        </Card.Content>
      </Card>
    )
  );
};

export default InProcessOrderItem;
