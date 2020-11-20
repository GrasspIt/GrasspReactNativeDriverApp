import React, { useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, Alert, Clipboard } from 'react-native';
import {
  Button,
  IconButton,
  useTheme,
  Card,
  Divider,
  List,
  ActivityIndicator,
} from 'react-native-paper';
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

  const handleCopyToClipboard = async () => {
    await Clipboard.setString(medicalRecommendation.idNumber);
    Alert.alert('Copied to clipboard.');
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
                      <List.Item
                        key={userNote.id}
                        title={`${userNote.note}`}
                        description={`${Moment(userNote.createdTimestamp).format(
                          'MMMM Do YYYY, h:mm a'
                        )}`}
                        descriptionStyle={{ alignSelf: 'flex-end' }}
                        titleNumberOfLines={3}
                      />
                    ))
                ) : (
                  <List.Item title='No active notes.' />
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

            {order.specialInstructions && (
              <Card style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <Card.Title title='Special Instructions:' />
                <Card.Content>
                  <Text>{order.specialInstructions}</Text>
                </Card.Content>
              </Card>
            )}

            <Card style={{ marginHorizontal: 10, marginBottom: 10 }}>
              {order.userFirstTimeOrderWithDSPR && <Card.Title title='FIRST TIME ORDER' />}
              <Card.Content>
                {medicalRecommendation ? (
                  <List.Item title='Medical User' titleStyle={{ fontWeight: 'bold' }} />
                ) : (
                  <List.Item title='Adult User' titleStyle={{ fontWeight: 'bold' }} />
                )}

                {orderDate && <List.Item title={`${orderDate}`} />}

                {user && (
                  <List.Item
                    title={`${user.firstName} ${user.lastName}, ${formatPhone(user.phoneNumber)}`}
                    titleNumberOfLines={2}
                  />
                )}

                {idDocument && (
                  <>
                    <List.Item
                      title='Identification Document:'
                      description={`${idDocument.idNumber}`}
                    />
                    <List.Item
                      title='Birth Date:'
                      description={`${birthDate ? birthDate : 'Not provided'}`}
                    />
                  </>
                )}

                {medicalRecommendation && (
                  <List.Item
                    title='Medical ID'
                    description={`${medicalRecommendation.idNumber}`}
                    right={() => (
                      <IconButton
                        icon='content-copy'
                        color={colors.primary}
                        size={20}
                        onPress={handleCopyToClipboard}
                      />
                    )}
                  />
                )}

                {address && address.aptNumber ? (
                  <List.Item
                    title={`${address.street}, ${address.zipCode}
                  ${address.aptNumber && `, Unit ${address.aptNumber}`}`}
                    titleNumberOfLines={2}
                  />
                ) : (
                  <List.Item
                    title={`${address.street}, ${address.zipCode}`}
                    titleNumberOfLines={2}
                  />
                )}

                {order.orderDetails &&
                  order.orderDetails.map((detail) => (
                    <OrderDetailListItem
                      key={`${detail.product.id}-${detail.unit || '0'}`}
                      orderDetail={detail}
                    />
                  ))}
                <Divider />

                {order.coupon && (
                  <>
                    <List.Item title='Code' description={`${order.coupon.code}`} />
                    <List.Item title='Discount' description={`$${order.discountTotal}`} />
                  </>
                )}

                {order.cashTotalPreTaxesAndFees && (
                  <List.Item
                    title='Subtotal'
                    description={`$${order.cashTotalPreTaxesAndFees.toFixed(2)}`}
                  />
                )}

                {order.orderTaxDetails && order.orderTaxDetails.length !== 0 ? (
                  order.orderTaxDetails
                    .slice(0)
                    .reverse()
                    .map((detail) => (
                      <List.Item
                        key={detail.name + detail.amount.toString()}
                        title={`${detail.name} : ${detail.rate}%`}
                        description={`$${detail.amount.toFixed(2)}`}
                      />
                    ))
                ) : (
                  <List.Item key='Tax0' title='Tax' description='$0.00' />
                )}
                <List.Item title='Delivery Fee' description={`$${order.deliveryFee.toFixed(2)}`} />
                <List.Item title={`Total: $${order.cashTotal.toFixed(2)}`} />
              </Card.Content>
            </Card>
            {order.orderStatus && (
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
    paddingBottom: 30,
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
