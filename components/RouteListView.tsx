import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import InProcessOrderItem from '../components/InProcessOrderItem';
import OrderItem from '../components/OrderItem';

type Props = {
  navigation;
  ordersForRoute;
};

const RouteListView = ({ navigation, ordersForRoute }: Props) => {
  const { colors } = useTheme();

  let queuedOrders =
    ordersForRoute && ordersForRoute.filter((leg) => leg.order.orderStatus === 'queued');
  let inProcessOrder =
    ordersForRoute && ordersForRoute.find((leg) => leg.order.orderStatus === 'in_process');
  return ordersForRoute ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listTitle}>In Process Order</Text>
        <Divider />

        {ordersForRoute.some((leg) => leg.order.orderStatus === 'in_process') ? (
          <InProcessOrderItem orderInfo={inProcessOrder.order} navigation={navigation} />
        ) : (
          <View style={[styles.empty, { backgroundColor: colors.background }]}>
            <Text>No order in process.</Text>
          </View>
        )}

        <Divider />
        <Text style={styles.listTitle}>Queued Orders</Text>
        <Divider />

        <FlatList
          ListEmptyComponent={
            <View style={[styles.empty, { backgroundColor: colors.background }]}>
              <Text>No orders.</Text>
            </View>
          }
          data={queuedOrders}
          renderItem={(item) => <OrderItem orderInfo={item.item.order} navigation={navigation} />}
          keyExtractor={(item: any) => item.id.toString() + '-routeList'}
          style={{ paddingHorizontal: 10 }}
        />
      </View>
    </SafeAreaView>
  ) : null;
};

const styles = StyleSheet.create({
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
});

export default RouteListView;
