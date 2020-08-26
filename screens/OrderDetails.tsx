import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { getOrderDetailsWithId, GET_ORDER_DETAILS_WITH_ID_FAILURE } from '../actions/orderActions';

import { getUserNotesFromProps } from '../selectors/userSelectors';
import {
  getUserIdDocumentFromPropsWithOrder,
  getUserMedicalRecommendations,
} from '../selectors/userDocumentsSelector';
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
import OrderButtons from '../components/OrderButtons';

type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route;
};
const OrderDetails = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();

  const { orderInfo, user, address } = route.params;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(orderInfo);

  const idDocument = useSelector<State, IdDocument>(
    (state) =>
      getUserIdDocumentFromPropsWithOrder(state, {
        userId: user.id,
        order: order,
      }),
    shallowEqual
  );
  const medicalRecommendations = useSelector<State, { [key: number]: MedicalRecommendation }>(
    (state) => getUserMedicalRecommendations(state),
    shallowEqual
  );

  const date = parseDate(orderInfo.createdTime);
  const birthDate = idDocument && parseDate(idDocument.birthDate);
  const medicalRecommendation =
    order &&
    order.userMedicalRecommendation &&
    medicalRecommendations[order.userMedicalRecommendation];

  useEffect(() => {
    const getOrderDetails = () => {
      dispatch<any>(getOrderDetailsWithId(orderInfo.id)).then((response) => {
        if (response.type === GET_ORDER_DETAILS_WITH_ID_FAILURE) {
          setError(response.error);
        } else {
          const orderWithDetails =
            response.response &&
            response.response.entities &&
            response.response.entities.orders &&
            response.response.entities.orders[orderInfo.id];
          if (orderWithDetails) {
            setError('');
            setOrder(orderWithDetails);
          } else {
            setError(
              'An unexpected error happened when fetching the order details. Please try again.'
            );
          }
        }
        setIsLoading(false);
      });
    };
    setIsLoading(true);
    getOrderDetails();
  }, [orderInfo]);

  if (isLoading)
    return (
      <View style={styles.fillScreen}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (error)
    return (
      <View style={styles.fillScreen}>
        <Text>{error}</Text>
      </View>
    );

  return (
    <>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Special Instructions:</Text>
        <Text style={styles.userDetails}>{orderInfo.specialInstructions}</Text>
        <View style={styles.userContainer}>
          <Text style={styles.title}>Medical User</Text>
          <Text style={styles.userDetails}>
            {date.toLocaleString('en-us', { month: 'long' })} {date.getDate()}, {date.getFullYear()}
            , at{' '}
            {date.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </Text>
          <Text style={styles.userDetails}>
            {user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}
          </Text>
          {idDocument ? (
            <View>
              <Text style={styles.userDetails}>Identification Document: {idDocument.idNumber}</Text>
              <Text style={styles.userDetails}>
                Birth Date: &nbsp;
                {birthDate ? (
                  <Text>
                    {birthDate.toLocaleString('en-us', { month: 'long' })} {birthDate.getDate()},{' '}
                    {birthDate.getFullYear()}
                  </Text>
                ) : (
                  <Text>Not provided</Text>
                )}
              </Text>
            </View>
          ) : null}
          {medicalRecommendation ? (
            <Text style={styles.userDetails}>Medical ID: {medicalRecommendation.idNumber}</Text>
          ) : null}
          <Text style={styles.userDetails}>
            {address.street}, {address.zipCode}
          </Text>
        </View>
        <ListItem
          title="Product"
          subtitle="company"
          rightSubtitle="price"
          bottomDivider
          topDivider
        />
        <ListItem title="Subtotal" subtitle={`$${orderInfo.cashTotalPreTaxesAndFees.toFixed(2)}`} />
        <ListItem
          title="State and Local Sales Tax: %"
          subtitle={`$${orderInfo.taxesTotal.toFixed(2)}`}
        />
        <ListItem title="Delivery Fee" subtitle={`$${orderInfo.deliveryFee.toFixed(2)}`} />
        <ListItem title={`Total: ${orderInfo.cashTotal.toFixed(2)}`} />
      </ScrollView>
      <OrderButtons navigation={navigation} orderId={orderInfo.id} />
    </>
  );
};

const styles = StyleSheet.create({
  fillScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: 10,
    paddingBottom: 30,
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
});

export default OrderDetails;
