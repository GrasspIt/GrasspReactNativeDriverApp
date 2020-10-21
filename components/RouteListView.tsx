import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button, Divider, useTheme } from 'react-native-paper';
import InProcessOrderItem from '../components/InProcessOrderItem';
import OrderItem from '../components/OrderItem';
import { refreshDSPRDriver, getDSPRDriver } from '../actions/driverActions';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';
import { connect } from 'react-redux';

type Props = {
  navigation;
  dsprDriver;
  ordersForRoute;
};

const RouteListView = ({ navigation, ordersForRoute, dsprDriver }: Props) => {
  const { colors } = useTheme();
  return dsprDriver && ordersForRoute ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listTitle}>In Process Order</Text>
        <Divider />

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

        <Divider />
        <Text style={styles.listTitle}>Queued Orders</Text>
        <Divider />

        <FlatList
          ListEmptyComponent={
            <View style={[styles.empty, { backgroundColor: colors.background }]}>
              <Text>No orders.</Text>
            </View>
          }
          data={ordersForRoute.filter((order) => order.orderStatus === 'queued')}
          renderItem={(item) => <OrderItem orderInfo={item.item} navigation={navigation} />}
          keyExtractor={(item: any) => item.id.toString() + '-routeList'}
          style={{ paddingHorizontal: 10 }}
        />
      </View>
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
  const error = state.api.errorMessage;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
    dsprDriver,
    isLoading,
    error,
  };
};

const mapDispatchToProps = { refreshDSPRDriver, getDSPRDriver };

export default connect(mapStateToProps, mapDispatchToProps)(RouteListView);
