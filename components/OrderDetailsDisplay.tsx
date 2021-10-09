import React, { useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import {
    Button,
    IconButton,
    useTheme,
    Card,
    Divider,
    List,
    ActivityIndicator,
} from 'react-native-paper';
import OrderDetailListItem from '../components/OrderDetailListItem';
import Moment from 'moment';
import { formatPhone, handleMap, handlePhone } from '../utils/util';

import OrderButtons from './buttons/OrderButtons';

type Props = {
    navigation;
    order;
    orderDate;
    birthDate;
    orderId;
    user;
    address;
    userNotes;
    idDocument;
    medicalRecommendation;
    isLoading;
    getOrderDetailsWithId;
    getOrderDetails;
    orderIdsInRoute;
    activeRoute;
    handleManageNotes;
    handleCopyToClipboard;
    completeOrder;
    cancelOrder;
    markOrderInProcess;
    removeOrderAndRefreshRoute;
    deactivateDriverRoute;
    isScanningDSPR: boolean;
    isScanningComplete: boolean;
    isLoadingOnInitialMount: boolean;
};
const OrderDetailsDisplay = ({
                                 navigation,
                                 isLoading,
                                 order,
                                 orderDate,
                                 birthDate,
                                 orderId,
                                 user,
                                 address,
                                 userNotes,
                                 idDocument,
                                 medicalRecommendation,
                                 getOrderDetails,
                                 orderIdsInRoute,
                                 activeRoute,
                                 handleManageNotes,
                                 handleCopyToClipboard,
                                 completeOrder,
                                 cancelOrder,
                                 markOrderInProcess,
                                 removeOrderAndRefreshRoute,
                                 deactivateDriverRoute,
                                 isScanningDSPR,
                                 isScanningComplete,
                                 isLoadingOnInitialMount,
                             }: Props) => {
    const {colors} = useTheme();

    useEffect(() => {
        if (order.orderStatus === 'canceled' || order.orderStatus === 'completed') navigation.goBack();
    }, [order]);

    return (
        <SafeAreaView style={{flex: 1}}>
            {isLoading || isLoadingOnInitialMount ? (
                <View style={[styles.fillScreen, {backgroundColor: colors.background}]}>
                    <ActivityIndicator size='large' color={colors.primary}/>
                </View>
            ) : order ? (
                <>
                    <ScrollView style={[styles.scroll, {backgroundColor: colors.background}]}>
                        <Card style={{margin: 10}}>
                            <Card.Title title='Notes'/>
                            <Card.Content>
                                {userNotes && userNotes.some((note) => note.isVisible) ? (
                                    userNotes
                                        .filter((note) => note.isVisible)
                                        .map((userNote) => (
                                            <List.Item
                                                key={userNote.id}
                                                title={<Text>{userNote.note}</Text>}
                                                description={`${Moment(userNote.createdTimestamp).format(
                                                    'MMMM Do YYYY, h:mm a'
                                                )}`}
                                                descriptionStyle={{alignSelf: 'flex-end'}}
                                                titleNumberOfLines={3}
                                            />
                                        ))
                                ) : (
                                    <List.Item title={<Text>No active notes.</Text>}/>
                                )}
                            </Card.Content>
                            <Card.Actions style={{alignSelf: 'flex-end'}}>
                                <Button
                                    mode='text'
                                    onPress={handleManageNotes}
                                    color={colors.primary}
                                    labelStyle={{paddingVertical: 4, color: colors.primary}}
                                >
                                    Manage Notes
                                </Button>
                            </Card.Actions>
                        </Card>

                        {order.specialInstructions && (
                            <Card style={{marginHorizontal: 10, marginBottom: 10}}>
                                <Card.Title title='Special Instructions:'/>
                                <Card.Content>
                                    <Text>{order.specialInstructions}</Text>
                                </Card.Content>
                            </Card>
                        )}

                        <Card style={{marginHorizontal: 10, marginBottom: 10}}>
                            {order.userFirstTimeOrderWithDSPR && <Card.Title title='FIRST TIME ORDER'/>}
                            <Card.Content>
                                {medicalRecommendation ? (
                                    <List.Item title={<Text>Medical User</Text>} titleStyle={{fontWeight: 'bold'}}/>
                                ) : (
                                    <List.Item title={<Text>Adult User</Text>} titleStyle={{fontWeight: 'bold'}}/>
                                )}

                                {orderDate && <List.Item title={<Text>{orderDate}</Text>}/>}

                                {user && (
                                    <List.Item
                                        title={
                                            <Text>{user.firstName} {user.lastName}, {formatPhone(user.phoneNumber)}</Text>}
                                        titleNumberOfLines={2}
                                        right={() => (
                                            <IconButton
                                                icon='phone'
                                                color={colors.primary}
                                                size={20}
                                                onPress={() => handlePhone(user)}
                                            />
                                        )}
                                    />
                                )}

                                {idDocument && (
                                    <View>
                                        <List.Item
                                            title={<Text>Identification Document:</Text>}
                                            description={`${idDocument.idNumber}`}
                                        />
                                        <List.Item
                                            title={<Text>Birth Date:</Text>}
                                            description={`${birthDate ? birthDate : 'Not provided'}`}
                                        />
                                    </View>
                                )}

                                {medicalRecommendation && (
                                    <List.Item
                                        title={<Text>Medical ID</Text>}
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
                                        title={<Text>{address.street}, {address.zipCode},
                                            Unit {address.aptNumber}</Text>}
                                        titleNumberOfLines={2}
                                        right={() => (
                                            <IconButton
                                                icon='map'
                                                color={colors.primary}
                                                size={20}
                                                onPress={() => handleMap(address)}
                                            />
                                        )}
                                    />
                                ) : (
                                    <List.Item
                                        title={<Text>{address.street}, {address.zipCode}</Text>}
                                        titleNumberOfLines={2}
                                        right={() => (
                                            <IconButton
                                                icon='map'
                                                color={colors.primary}
                                                size={20}
                                                onPress={() => handleMap(address)}
                                            />
                                        )}
                                    />
                                )}

                                {order.calculatedOrderDetails &&
                                order.calculatedOrderDetails.map((detail) => (
                                    <OrderDetailListItem
                                        key={`${detail.product.id}-${detail.unit || '0'}-${
                                            (detail.appliedCoupon && detail.appliedCoupon.code) || 'none'
                                        }`}
                                        orderDetail={detail}
                                    />
                                ))}
                                <Divider/>

                                {order.coupons && order.coupons.length > 0 && (
                                    <View>
                                        <List.Item
                                            title={order.coupons.length === 1 ? <Text>Code</Text> : <Text>Codes</Text>}
                                            description={order.coupons
                                                .map((couponFromList) => couponFromList.code)
                                                .join('\n')}
                                        />
                                        <List.Item title={<Text>Discount</Text>}
                                                   description={`$${order.discountTotal}`}/>
                                    </View>
                                )}

                                {order.cashTotalPreTaxesAndFees && (
                                    <List.Item
                                        title={<Text>Subtotal</Text>}
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
                                                title={<Text>{detail.name} : {detail.rate}%</Text>}
                                                description={`$${detail.amount.toFixed(2)}`}
                                            />
                                        ))
                                ) : (
                                    <List.Item key='Tax0' title={<Text>Tax</Text>} description='$0.00'/>
                                )}
                                <List.Item title={<Text>Delivery Fee</Text>}
                                           description={`$${order.deliveryFee.toFixed(2)}`}/>
                                <List.Item title={<Text>Total: ${order.cashTotal.toFixed(2)}</Text>}/>
                            </Card.Content>
                        </Card>
                        {order.orderStatus && (
                            <OrderButtons
                                isLoading={isLoading}
                                orderId={orderId}
                                orderStatus={order.orderStatus}
                                orderIdsInRoute={orderIdsInRoute}
                                activeRoute={activeRoute}
                                completeOrder={completeOrder}
                                cancelOrder={cancelOrder}
                                markOrderInProcess={markOrderInProcess}
                                removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
                                deactivateDriverRoute={deactivateDriverRoute}
                                navigation={navigation}
                                isScanningDSPR={isScanningDSPR}
                                isScanningComplete={isScanningComplete}
                            />
                        )}
                    </ScrollView>
                </>
            ) : (
                <View style={[styles.fillScreen, {backgroundColor: colors.background}]}>
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

export default OrderDetailsDisplay;