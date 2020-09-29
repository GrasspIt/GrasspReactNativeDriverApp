import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Clipboard } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Button, Title, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import { getOrderDetailsWithId } from '../actions/orderActions';
import { getUserFromProps, getUserNotesFromProps } from '../selectors/userSelectors';
import {
  getUserIdDocumentFromPropsWithOrder,
  getUserMedicalRecommendations,
} from '../selectors/userDocumentsSelector';
import OrderDetailListItem from '../components/OrderDetailListItem';
import Colors from '../constants/Colors';
import Moment from 'moment';
import { formatPhone } from '../hooks/util';

import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import OrderButtons from '../components/OrderButtons';
import { Divider } from 'react-native-paper';
import { getOrderFromProps } from '../selectors/orderSelectors';
import { getAddressFromProps } from '../selectors/addressSelectors';

type DetailsScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  order;
  orderId;
  user;
  address;
  userNotes;
  idDocument;
  medicalRecommendation;
  isLoading;
  error;
  getOrderDetailsWithId;
};
const OrderDetails = ({
  navigation,
  isLoading,
  error,
  order,
  orderId,
  user,
  address,
  userNotes,
  idDocument,
  medicalRecommendation,
  getOrderDetailsWithId,
}: Props) => {
  const orderDate = Moment(order.createdTime).format('MMMM Do YYYY, h:mm a');
  const birthDate = idDocument && Moment(idDocument.birthDate).format('MMMM Do YYYY');

  useEffect(() => {
    getOrderDetailsWithId(orderId);
  }, [orderId]);

  const handleManageNotes = () => {
    navigation.navigate('Notes', { userId: user.id, dsprDriverId: order.dsprDriver, userNotes });
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.fillScreen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.fillScreen}>
          <Text>{error}</Text>
          <Button onPress={() => getOrderDetailsWithId(orderId)}>Try Again</Button>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scroll}>
            <Title>Notes</Title>
            {userNotes && userNotes.some((note) => note.isVisible) ? (
              userNotes
                .filter((note) => note.isVisible)
                .map((userNote) => (
                  <ListItem key={userNote.id}>
                    <ListItem.Content>
                      <ListItem.Title>{userNote.note}</ListItem.Title>
                      <ListItem.Subtitle style={{ alignSelf: 'flex-end', paddingTop: 6 }}>
                        {Moment(userNote.createdTimestamp).format('MMMM Do YYYY, h:mm a')}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))
            ) : (
              <View style={styles.empty}>
                <Text style={{ fontSize: 16 }}>No active notes.</Text>
              </View>
            )}
            <Button
              mode="contained"
              onPress={handleManageNotes}
              color={Colors.primary}
              labelStyle={{ color: Colors.light }}
            >
              Manage Notes
            </Button>
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

            {orderDate ? (
              <ListItem>
                <ListItem.Title>{orderDate}</ListItem.Title>
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
                  <ListItem.Content>
                    <ListItem.Title>Identification Document:</ListItem.Title>
                    <ListItem.Subtitle>{idDocument.idNumber}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
                <ListItem>
                  <ListItem.Title>
                    Birth Date: &nbsp;
                    {birthDate ? <Text>{birthDate}</Text> : <Text>Not provided</Text>}{' '}
                  </ListItem.Title>
                </ListItem>
              </View>
            ) : null}

            {medicalRecommendation ? (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>Medical ID:</ListItem.Title>
                  <ListItem.Subtitle>{medicalRecommendation.idNumber}</ListItem.Subtitle>
                </ListItem.Content>
                <IconButton
                  icon="content-copy"
                  color={Colors.primary}
                  size={20}
                  onPress={() => Clipboard.setString(medicalRecommendation.idNumber)}
                />
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
          <OrderButtons navigation={navigation} orderId={orderId} orderStatus={order.orderStatus} />
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
  empty: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    padding: 14,
  },
});

const mapStateToProps = (state, route) => {
  const { orderId } = route.route.params;
  const order = getOrderFromProps(state, { orderId });
  const user = order && getUserFromProps(state, { userId: order.user });
  const address = order && getAddressFromProps(state, { addressId: order.address });
  const userNotes = user && getUserNotesFromProps(state, { userId: user.id });
  const idDocument =
    user &&
    getUserIdDocumentFromPropsWithOrder(state, {
      userId: user.id,
      order: order,
    });
  const medicalRecommendations = getUserMedicalRecommendations(state);
  const medicalRecommendation = order && medicalRecommendations[order.userMedicalRecommendation];
  const isLoading = state.api.isLoading;
  const error = state.api.errorMessage;
  return {
    order,
    orderId,
    user,
    address,
    userNotes,
    idDocument,
    medicalRecommendation,
    error,
    isLoading,
  };
};

const mapDispatchToProps = { getOrderDetailsWithId };

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
