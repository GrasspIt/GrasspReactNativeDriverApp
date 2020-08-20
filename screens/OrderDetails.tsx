import React from 'react';
import { View, ScrollView, Text, StyleSheet, Button } from 'react-native';
import Colors from '../constants/Colors';

import {
  User,
  Address,
  Order,
  IdDocument,
  State,
  MedicalRecommendation,
  DsprDriver,
  DspProduct,
  DsprDriverInventoryItem,
} from '../store/reduxStoreState';
import { parseDate, formatPhone } from '../hooks/util';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/ScreenNavigator';

type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'Details'
>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route;
};
const OrderDetails = ({ route, navigation }: Props) => {
  const { orderInfo, user, address } = route.params;
  console.log('user', user);
  console.log('orderInfo', orderInfo);

  const date = parseDate(orderInfo.createdTime);

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Special Instructions:</Text>
      <Text style={styles.userDetails}>{orderInfo.specialInstructions}</Text>
      <View style={styles.userContainer}>
        <Text style={styles.title}>Medical User</Text>
        <Text style={styles.userDetails}>
          {date.toLocaleString('en-us', { month: 'long' })} {date.getDate()},{' '}
          {date.getFullYear()}, at{' '}
          {date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </Text>
        <Text style={styles.userDetails}>
          {user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}
        </Text>
        <Text style={styles.userDetails}>Identificatioon Document: id#</Text>
        <Text style={styles.userDetails}>Birth Date: Month day, Year</Text>
        <Text style={styles.userDetails}>Medical ID: id#</Text>
        <Text style={styles.userDetails}>
          {address.street}, {address.zipCode}
        </Text>
      </View>
      <View style={styles.product}>
        <Text>Product</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text>SubTotal</Text>
        <Text>${orderInfo.cashTotalPreTaxesAndFees.toFixed(2)}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text>State and Local Sales Tax: %</Text>
        <Text>${orderInfo.taxesTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text>Delivery Fee</Text>
        <Text>${orderInfo.deliveryFee.toFixed(2)}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text>Total: ${orderInfo.cashTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel Order" onPress={() => console.log('cancel')} />
        <Button
          title="Complete Order"
          onPress={() => console.log('Complete')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  product: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.medium,
    borderBottomColor: Colors.medium,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    padding: 10,
  },
  userContainer: {
    marginTop: 20,
  },
  userDetails: {
    padding: 10,
  },
  priceDetails: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default OrderDetails;
