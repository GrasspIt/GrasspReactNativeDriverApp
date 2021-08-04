import React from 'react';
import { Text, View } from 'react-native';
import { formatPhone, handlePhone, handleMap } from '../utils/util';
import { Card, IconButton, useTheme, List } from 'react-native-paper';

const InProcessOrderItem = ({ orderInfo, navigation }) => {
  const { colors } = useTheme();

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
                title={<Text>{orderInfo.address.street}, {orderInfo.address.zipCode}, Unit {orderInfo.address.aptNumber}</Text>}
                titleNumberOfLines={2}
                style={{ padding: 0 }}
                left={() => (
                  <IconButton
                    icon='map'
                    color={colors.primary}
                    size={20}
                    onPress={() => handleMap(orderInfo.address)}
                  />
                )}
              />
            ) : (
              <List.Item
                title={<Text>{orderInfo.address.street}, {orderInfo.address.zipCode}</Text>}
                titleNumberOfLines={2}
                style={{ padding: 0 }}
                left={() => (
                  <IconButton
                    icon='map'
                    color={colors.primary}
                    size={20}
                    onPress={() => handleMap(orderInfo.address)}
                  />
                )}
              />
            )}
            <List.Item
              title={<Text>{formatPhone(orderInfo.user.phoneNumber)}</Text>}
              titleNumberOfLines={2}
              style={{ padding: 0 }}
              left={() => (
                <IconButton
                  icon='phone'
                  color={colors.primary}
                  size={20}
                  onPress={() => handlePhone(orderInfo.user)}
                />
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
