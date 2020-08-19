import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { State, Order, Address } from '../store/reduxStoreState';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { getAddresses } from '../selectors/addressSelectors';
import { getUsers } from '../selectors/userSelectors';
import { markOrderInProcess } from '../actions/orderActions';
import * as RootNavigation from '../navigation/RootNavigation';

type OrderProps = { orderInfo: Order };

const OrderItem = ({ orderInfo }: OrderProps) => {
  const dispatch = useDispatch();

  const addresses = useSelector<State, Address>(getAddresses);
  const addressList = Object.values(addresses);
  const address = addressList.find(
    (address) => address.id === orderInfo.address
  );

  const users = useSelector<State, Address>(getUsers);
  const userList = Object.values(users);
  const user = userList.find((user) => user.id === orderInfo.user);

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
          onPress={() => RootNavigation.navigate('Details', { orderInfo })}
        >
          <Entypo name="info-with-circle" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={orderInfo.orderStatus === 'queued' ? false : true}
          onPress={() => dispatch(markOrderInProcess(orderInfo.id))}
        >
          <FontAwesome
            name="gear"
            size={26}
            color={
              orderInfo.orderStatus === 'queued'
                ? Colors.primary
                : Colors.medium
            }
          />
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
