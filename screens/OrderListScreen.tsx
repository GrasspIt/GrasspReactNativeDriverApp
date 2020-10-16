import React from 'react';
import { View, Text, Alert, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import Colors from '../constants/Colors';
import TopNavBar from '../components/TopNavBar';
import { Divider } from 'react-native-paper';
import InProcessOrderItem from '../components/InProcessOrderItem';
import OrderItem from '../components/OrderItem';

import { refreshDSPRDriver } from '../actions/driverActions';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';
import { connect } from 'react-redux';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type OrderListScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Orders'>;
type Props = {
  navigation: OrderListScreenNavigationProp;
  driverId;
  loggedInUser;
  dsprDriver;
  isLoading;
  refreshDSPRDriver;
  error;
};

const OrderListScreen = ({
  navigation,
  driverId,
  loggedInUser,
  dsprDriver,
  isLoading,
  refreshDSPRDriver,
  error,
}: Props) => {
  const getDriverData = () => {
    if (loggedInUser) refreshDSPRDriver(driverId);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TopNavBar title='Orders' navigation={navigation} />
        <Text style={styles.listTitle}>In Process Order</Text>
        <Divider style={{ height: 1, marginHorizontal: 10 }} />

        {dsprDriver.currentInProcessOrder ? (
          <InProcessOrderItem
            orderInfo={dsprDriver.currentInProcessOrder}
            navigation={navigation}
          />
        ) : (
          <View style={styles.empty}>
            <Text>No order in process.</Text>
          </View>
        )}

        <Divider style={{ height: 2 }} />
        <Text style={styles.listTitle}>Queued Orders</Text>
        <Divider style={{ height: 1, marginHorizontal: 10 }} />

        <FlatList
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text>No orders.</Text>
            </View>
          }
          onRefresh={() => getDriverData()}
          refreshing={isLoading}
          data={dsprDriver.queuedOrders}
          renderItem={(item) => <OrderItem orderInfo={item.item} navigation={navigation} />}
          keyExtractor={(item: any) => item.id.toString()}
          style={styles.orders}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  empty: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  orders: {
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: driverId,
  });
  const isLoading = state.api.isLoading;
  const error = state.api.errorMessage;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
    dsprDriver,
    isLoading,
    error,
  };
};

const mapDispatchToProps = { refreshDSPRDriver };

export default connect(mapStateToProps, mapDispatchToProps)(OrderListScreen);
