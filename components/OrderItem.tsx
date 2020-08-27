import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { State, Order, Address, User } from '../store/reduxStoreState';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { markOrderInProcess } from '../actions/orderActions';
import * as RootNavigation from '../navigation/RootNavigation';

type OrderProps = { orderId: number };

const OrderItem = ({ orderId }: OrderProps) => {
  const dispatch = useDispatch();

  const orderInfo = useSelector<State, Order>((state) => state.api.entities.orders[orderId]);
  const address = useSelector<State, Address>(
    (state) => state.api.entities.addresses[orderInfo.address]
  );
  const user = useSelector<State, User>((state) => state.api.entities.users[orderInfo.user]);

  const [isInProcess, setIsInProcess] = useState(
    orderInfo.orderStatus == 'in_process' ? true : false
  );

  const handleProcessOrder = () => {
    dispatch(markOrderInProcess(orderInfo.id));
    setIsInProcess(!isInProcess);
  };

  return (
    <View style={styles.orderContainer}>
      <View>
        <View style={styles.topText}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName},
          </Text>
          <Text style={styles.cash}>${orderInfo.cashTotal}</Text>
        </View>
        <Text style={styles.address}>
          {address.street} {address.zipCode}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{ marginHorizontal: 30 }}
          onPress={() => RootNavigation.navigate('Details', { orderInfo, user, address })}
        >
          <Entypo name="info-with-circle" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity disabled={isInProcess} onPress={handleProcessOrder}>
          <FontAwesome name="gear" size={26} color={isInProcess ? Colors.medium : Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  name: { fontSize: 14 },
  cash: {
    color: Colors.dark,
    marginLeft: 4,
    fontSize: 12,
  },
  address: {
    color: Colors.dark,
    marginTop: 2,
    fontSize: 12,
  },
  topText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.medium,
  },
});

export default OrderItem;
