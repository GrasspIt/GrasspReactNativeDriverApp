import React from 'react';
import { Alert, Text, Platform, View, StyleSheet } from 'react-native';
import { formatPhone } from '../utils/util';
import * as Linking from 'expo-linking';
import { useTheme, Card, Button, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '../actions/orderActions';

const InProcessOrderItem = ({ orderInfo, navigation, ordersForRoute }) => {
  const dispatch = useDispatch();

  const { colors } = useTheme();
  let orderList = ordersForRoute && ordersForRoute.map((leg) => leg.order);

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(cancelOrder(orderInfo.id)) },
    ]);
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
        <Card.Content
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, paddingLeft: 16, paddingBottom: 4 }}>
                {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
              </Text>
              <Text style={{ fontSize: 14, paddingBottom: 4 }}>${orderInfo.cashTotal}</Text>
            </View>
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
          </View>
          <IconButton
            icon='chevron-right'
            onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
          />
        </Card.Content>
        <Card.Actions style={{ padding: 0 }}>
          <Button
            icon='cancel'
            mode='contained'
            color={colors.error}
            style={styles.buttons}
            labelStyle={{ color: colors.surface }}
            onPress={handleCancelOrder}
          >
            Cancel Order
          </Button>
          {orderList && orderList.includes(orderInfo) && (
            <Button
              icon='map-minus'
              mode='contained'
              color={colors.error}
              style={styles.buttons}
              labelStyle={{ color: colors.surface }}
              onPress={handleCancelOrder}
            >
              Remove From Route
            </Button>
          )}
        </Card.Actions>
      </Card>
    )
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    elevation: 0,
    margin: 2,
  },
});

export default InProcessOrderItem;
