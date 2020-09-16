import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector, useDispatch, shallowEqual, connect } from 'react-redux';
import { getOrderDetailsWithId } from '../actions/orderActions';
import {
  getSpecificUser,
  createUserNote,
  hideUserNote,
  unhideUserNote,
} from '../actions/userActions';
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
  DsprManager,
  DsprDriver,
  DspProduct,
  DsprDriverInventoryItem,
} from '../store/reduxStoreState';
import { parseDate, formatPhone } from '../hooks/util';

import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import OrderButtons from '../components/OrderButtons';
import UserNotes from '../components/UserNotes';
import { Divider } from 'react-native-paper';

type DetailsScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route;
  isLoading;
};
const OrderDetails = ({ route, navigation, isLoading }: Props) => {
  const dispatch = useDispatch();

  const { order } = route.params;
  const user = order && order.user;
  const address = order && order.address;
  const [error, setError] = useState('');

  const userNotes = useSelector<State, any[]>(
    (state) => getUserNotesFromProps(state, { userId: user.id }),
    shallowEqual
  );
  const idDocument = useSelector<State, IdDocument | null>(
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

  const date = parseDate(order.createdTime);
  const birthDate = idDocument && parseDate(idDocument.birthDate);
  const medicalRecommendation =
    order &&
    order.userMedicalRecommendation &&
    medicalRecommendations[order.userMedicalRecommendation];

  useEffect(() => {
    dispatch(getOrderDetailsWithId(order.id));
  }, [order.id]);

  return (
    <>
      {isLoading ? (
        <View style={styles.fillScreen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.fillScreen}>
          <Text>{error}</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scroll}>
            <UserNotes
              createUserNote={(userId, note, dsprDriverId) =>
                dispatch(createUserNote(userId, note, dsprDriverId, null))
              }
              hideUserNote={(noteId) => dispatch(hideUserNote(noteId))}
              unhideUserNote={(noteId) => dispatch(unhideUserNote(noteId))}
              userId={user.id}
              dsprDriverId={order.dsprDriver}
              userNotes={userNotes}
              refreshUser={() => dispatch(getSpecificUser(user.id))}
            />

            {order && order.specialInstructions ? (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: 'bold' }}>
                    Special Instructions:
                  </ListItem.Title>
                  <ListItem.Subtitle>{order.specialInstructions}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ) : null}

            {order && order.userFirstTimeOrderWithDSPR ? (
              <ListItem>
                <ListItem.Title style={{ fontWeight: 'bold' }}>FIRST TIME ORDER</ListItem.Title>
              </ListItem>
            ) : null}

            {medicalRecommendation ? (
              <ListItem>
                <ListItem.Title style={{ fontWeight: 'bold' }}>Medical User</ListItem.Title>
              </ListItem>
            ) : (
              <ListItem>
                <ListItem.Title style={{ fontWeight: 'bold' }}>Adult User</ListItem.Title>
              </ListItem>
            )}

            {date ? (
              <ListItem>
                <ListItem.Title>
                  {date.toLocaleString('en-us', { month: 'long' })} {date.getDate()},{' '}
                  {date.getFullYear()}, at{' '}
                  {date.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}{' '}
                </ListItem.Title>
              </ListItem>
            ) : null}

            {user ? (
              <ListItem>
                <ListItem.Title>
                  {user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}
                </ListItem.Title>
              </ListItem>
            ) : null}

            {idDocument ? (
              <View>
                <ListItem>
                  <ListItem.Title>Identification Document: {idDocument.idNumber}</ListItem.Title>
                </ListItem>
                <ListItem>
                  <ListItem.Title>
                    Birth Date: &nbsp;
                    {birthDate ? (
                      <Text>
                        {birthDate.toLocaleString('en-us', { month: 'long' })} {birthDate.getDate()}
                        , {birthDate.getFullYear()}
                      </Text>
                    ) : (
                      <Text>Not provided</Text>
                    )}{' '}
                  </ListItem.Title>
                </ListItem>
              </View>
            ) : null}

            {medicalRecommendation ? (
              <ListItem>
                <ListItem.Title>Medical ID: {medicalRecommendation.idNumber} </ListItem.Title>
              </ListItem>
            ) : null}

            {address ? (
              <ListItem>
                <ListItem.Title>
                  {address.street}, {address.zipCode}
                </ListItem.Title>
              </ListItem>
            ) : null}

            {order && order.orderDetails
              ? order.orderDetails.map((detail) => (
                  <OrderDetailListItem
                    key={`${detail.product.id}-${detail.unit || '0'}`}
                    orderDetail={detail}
                  />
                ))
              : null}
            <Divider />

            {order && order.coupon ? (
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
                <ListItem.Subtitle>{`$${order.cashTotalPreTaxesAndFees.toFixed(
                  2
                )}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>

            {order && order.orderTaxDetails && order.orderTaxDetails.length !== 0 ? (
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
                <ListItem.Subtitle>{`$${order.deliveryFee.toFixed(2)}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>

            <ListItem>
              <ListItem.Content>
                <ListItem.Title>{`Total: $${order.cashTotal.toFixed(2)}`}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </ScrollView>
          <OrderButtons
            navigation={navigation}
            orderId={order.id}
            orderStatus={order.orderStatus}
          />
        </>
      )}
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
});

const mapStateToProps = (state) => {
  // const driverId = state.api.dsprDriverId;
  // const dsprDriver = getDSPRDriverWithUserAndOrdersFromProps(state, { dsprDriverId: driverId });
  // const dspr = dsprDriver ? getDSPRFromProps(state, { dsprId: dsprDriver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  return {
    isLoading,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
