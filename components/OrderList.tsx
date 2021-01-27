import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import InProcessOrderItem from '../components/InProcessOrderItem';
import OrderItem from '../components/OrderItem';
import { StatusBar } from 'expo-status-bar';

type Props = {
  navigation;
  dsprDriver;
  isLoading;
  getDriverData;
};

const OrderList = ({ navigation, dsprDriver, isLoading, getDriverData }: Props) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>In Process Order</Text>

          {dsprDriver.currentInProcessOrder ? (
            <InProcessOrderItem
              orderInfo={dsprDriver.currentInProcessOrder}
              navigation={navigation}
            />
          ) : (
            <View style={[styles.empty, { backgroundColor: colors.background }]}>
              <Text>No order in process.</Text>
            </View>
          )}

          <Text style={styles.listTitle}>Queued Orders</Text>

          <FlatList
            ListEmptyComponent={
              <View style={[styles.empty, { backgroundColor: colors.background }]}>
                <Text>No orders.</Text>
              </View>
            }
            onRefresh={() => getDriverData()}
            refreshing={isLoading}
            data={dsprDriver.queuedOrders}
            renderItem={(item) => (
              <OrderItem
                orderInfo={item.item}
                index={dsprDriver.queuedOrders.indexOf(item.item)}
                navigation={navigation}
              />
            )}
            keyExtractor={(item: any) => item.id.toString()}
            style={{ paddingHorizontal: 10 }}
          />
        </View>
      )}
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default OrderList;
