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
import OrderDetailListItem from '../components/OrderDetailListItem';
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
import { Divider } from 'react-native-paper';

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
  console.log('order', order);
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
        {order.specialInstructions ? (
          <Text style={styles.title}>
            <strong>Special Instructions:</strong> {order.specialInstructions}
          </Text>
        ) : null}

        <View style={styles.userContainer}>
          {order.userFirstTimeOrderWithDSPR ? (
            <ListItem>
              <ListItem.Title>FIRST TIME ORDER</ListItem.Title>
            </ListItem>
          ) : null}

          {medicalRecommendation ? (
            <Text style={styles.title}>Medical User</Text>
          ) : (
            <Text style={styles.title}>Adult User</Text>
          )}

          <Text style={styles.userDetails}>
            {date.toLocaleString('en-us', { month: 'long' })} {date.getDate()}, {date.getFullYear()}
            , at{' '}
            {date.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </Text>

          {user ? (
            <Text style={styles.userDetails}>
              {user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}
            </Text>
          ) : null}

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

          {address ? (
            <Text style={styles.userDetails}>
              {address.street}, {address.zipCode}
            </Text>
          ) : null}
        </View>

        {order && order.orderDetails
          ? order.orderDetails.map((detail) => (
              <OrderDetailListItem
                key={`${detail.product.id}-${detail.unit || '0'}`}
                orderDetail={detail}
              />
            ))
          : null}
        <Divider />

        {order.coupon ? (
          <>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Code</ListItem.Title>
                <ListItem.Subtitle>{`${order.coupon.code}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Discount</ListItem.Title>
                <ListItem.Subtitle>{`$${order.discountTotal}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </>
        ) : null}

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Subtotal</ListItem.Title>
            <ListItem.Subtitle>{`$${orderInfo.cashTotalPreTaxesAndFees.toFixed(
              2
            )}`}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        {order.orderTaxDetails.length !== 0 ? (
          order.orderTaxDetails
            .slice(0)
            .reverse()
            .map((detail) => (
              <ListItem key={detail.name + detail.amount.toString()}>
                <ListItem.Content>
                  <ListItem.Title>{`${detail.name} : ${detail.rate}%`}</ListItem.Title>
                  <ListItem.Subtitle>{`$${detail.amount.toFixed(2)}`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))
        ) : (
          <ListItem key="Tax0">
            <ListItem.Content>
              <ListItem.Title>Tax</ListItem.Title>
              <ListItem.Subtitle>$0.00</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Delivery Fee</ListItem.Title>
            <ListItem.Subtitle>{`$${orderInfo.deliveryFee.toFixed(2)}`}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{`Total: $${orderInfo.cashTotal.toFixed(2)}`}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
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
