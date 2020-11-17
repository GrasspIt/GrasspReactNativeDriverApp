import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import InProcessOrderItem from '../components/InProcessOrderItem';
import OrderItem from '../components/OrderItem';
import { refreshDSPRDriver, getDSPRDriver } from '../actions/driverActions';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';
import { connect } from 'react-redux';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

type OrderListScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Orders'>;
type Props = {
  navigation: OrderListScreenNavigationProp;
  driverId;
  loggedInUser;
  dsprDriver;
  isLoading;
  refreshDSPRDriver;
  getDSPRDriver;
};

const OrderListScreen = ({
  navigation,
  driverId,
  loggedInUser,
  dsprDriver,
  isLoading,
  getDSPRDriver,
}: Props) => {
  const { colors } = useTheme();

  const getDriverData = () => {
    if (loggedInUser) getDSPRDriver(driverId);
  };

  return loggedInUser && dsprDriver ? (
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
            renderItem={(item) => <OrderItem orderInfo={item.item} navigation={navigation} />}
            keyExtractor={(item: any) => item.id.toString()}
            style={{ paddingHorizontal: 10 }}
          />
        </View>
      )}
      <StatusBar style='dark' />
    </SafeAreaView>
  ) : null;
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

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: driverId,
  });
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
    dsprDriver,
    isLoading,
  };
};

const mapDispatchToProps = { refreshDSPRDriver, getDSPRDriver };

export default connect(mapStateToProps, mapDispatchToProps)(OrderListScreen);
