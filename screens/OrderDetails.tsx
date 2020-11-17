import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { ListItem, Divider } from 'react-native-elements';
import { Button, IconButton, useTheme, Card } from 'react-native-paper';
import { connect } from 'react-redux';
import { getOrderDetailsWithId } from '../actions/orderActions';
import { getUserFromProps, getUserNotesFromProps } from '../selectors/userSelectors';
import {
  getUserIdDocumentFromPropsWithOrder,
  getUserMedicalRecommendations,
} from '../selectors/userDocumentsSelector';
import OrderDetailListItem from '../components/OrderDetailListItem';
import Moment from 'moment';
import { formatPhone } from '../utils/util';

import { StackNavigationProp } from '@react-navigation/stack';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import OrderButtons from '../components/OrderButtons';
import { getOrderFromProps } from '../selectors/orderSelectors';
import { getAddressFromProps } from '../selectors/addressSelectors';

type DetailsScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Details'>;

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
  getOrderDetailsWithId;
};
const OrderDetails = ({
  navigation,
  isLoading,
  order,
  orderId,
  user,
  address,
  userNotes,
  idDocument,
  medicalRecommendation,
  getOrderDetailsWithId,
}: Props) => {
  const { colors } = useTheme();

  const orderDate = order && Moment(order.createdTime).format('MMMM Do YYYY, h:mm a');
  const birthDate = idDocument && Moment(idDocument.birthDate).format('MMMM Do YYYY');

  const handleNavigate = () => {
    if (order && order.status) {
      if (order.orderStatus == 'completed' || order.orderStatus == 'canceled') navigation.goBack();
    }
  };

  const getOrderDetails = () => {
    if (order && order.id) getOrderDetailsWithId(order.id);
  };

  const orderStatusDefined = order && order.orderStatus;

  useEffect(() => {
    handleNavigate();
  }, [orderStatusDefined]);

  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleManageNotes = () => {
    navigation.navigate('Notes', { userId: user.id, dsprDriverId: order.dsprDriver, userNotes });
  };

  const handleCopyToClipboard = () => {
    Alert.alert('Copied to clipboard.');
    Clipboard.setString(medicalRecommendation.idNumber);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.fillScreen, { backgroundColor: colors.background }]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : order ? (
        <>
          <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]}>
            <Card style={{ margin: 10 }}>
              <Card.Title title='Notes' />
              <Card.Content>
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
                  // <View style={[styles.empty, { backgroundColor: colors.background }]}>
                  <Text style={{ fontSize: 16 }}>No active notes.</Text>
                  // </View>
                )}
              </Card.Content>
              <Card.Actions style={{ alignSelf: 'flex-end' }}>
                <Button
                  mode='text'
                  onPress={handleManageNotes}
                  color={colors.primary}
                  labelStyle={{ paddingVertical: 4, color: colors.primary }}
                >
                  Manage Notes
                </Button>
              </Card.Actions>
            </Card>

            {order && order.specialInstructions && (
              <Card style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <Card.Title title='Special Instructions:' />
                <Card.Content>
                  <Text>{order.specialInstructions}</Text>
                </Card.Content>
              </Card>
            )}

            <Card style={{ marginHorizontal: 10, marginBottom: 10 }}>
              {order && order.userFirstTimeOrderWithDSPR && <Card.Title title='FIRST TIME ORDER' />}
              <Card.Content>
                {medicalRecommendation ? (
                  <ListItem>
                    <ListItem.Title style={{ fontWeight: 'bold' }}>Medical User</ListItem.Title>
                  </ListItem>
                ) : (
                  <ListItem>
                    <ListItem.Title style={{ fontWeight: 'bold' }}>Adult User</ListItem.Title>
                  </ListItem>
                )}

                {orderDate && (
                  <ListItem>
                    <ListItem.Title>{orderDate}</ListItem.Title>
                  </ListItem>
                )}

                {user && (
                  <ListItem>
                    <ListItem.Title>
                      {user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}
                    </ListItem.Title>
                  </ListItem>
                )}

                {idDocument && (
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
                )}

                {medicalRecommendation && (
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>Medical ID:</ListItem.Title>
                      <ListItem.Subtitle>{medicalRecommendation.idNumber}</ListItem.Subtitle>
                    </ListItem.Content>
                    <IconButton
                      icon='content-copy'
                      color={colors.primary}
                      size={20}
                      onPress={handleCopyToClipboard}
                    />
                  </ListItem>
                )}

                {address && (
                  <ListItem>
                    <ListItem.Title>
                      {address.street}, {address.zipCode}
                      {address.aptNumber && `, Unit ${address.aptNumber}`}
                    </ListItem.Title>
                  </ListItem>
                )}

                {order &&
                  order.orderDetails &&
                  order.orderDetails.map((detail) => (
                    <OrderDetailListItem
                      key={`${detail.product.id}-${detail.unit || '0'}`}
                      orderDetail={detail}
                    />
                  ))}
                <Divider />

                {order && order.coupon && (
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
                )}

                {order && order.cashTotalPreTaxesAndFees && (
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>Subtotal</ListItem.Title>
                      <ListItem.Subtitle>{`$${order.cashTotalPreTaxesAndFees.toFixed(
                        2
                      )}`}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                )}

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
                  <ListItem key='Tax0'>
                    <ListItem.Content>
                      <ListItem.Title>Tax</ListItem.Title>
                      <ListItem.Subtitle>$0.00</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                )}

                {order && (
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>Delivery Fee</ListItem.Title>
                      <ListItem.Subtitle>{`$${order.deliveryFee.toFixed(2)}`}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                )}

                {order && (
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>{`Total: $${order.cashTotal.toFixed(2)}`}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                )}
              </Card.Content>
            </Card>
            {order && order.orderStatus && (
              <OrderButtons orderId={orderId} orderStatus={order.orderStatus} />
            )}
          </ScrollView>
        </>
      ) : (
        <View style={[styles.fillScreen, { backgroundColor: colors.background }]}>
          <Text>Failed to fetch order details.</Text>
          <Button mode='text' onPress={getOrderDetails}>
            Try Again
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fillScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    // paddingHorizontal: 10,
    paddingBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    padding: 10,
  },
  empty: {
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
  return {
    order,
    orderId,
    user,
    address,
    userNotes,
    idDocument,
    medicalRecommendation,
    isLoading,
  };
};

const mapDispatchToProps = { getOrderDetailsWithId };

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
