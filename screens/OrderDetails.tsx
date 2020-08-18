import React from 'react';
import { View, ScrollView, Text, StyleSheet, Button } from 'react-native';
import Colors from '../constants/Colors';

import { User, Address, Order, IdDocument, State, MedicalRecommendation, DsprDriver, DspProduct, DsprDriverInventoryItem } from '../store/reduxStoreState';

type DetailProps = { orderInfo: Order; }

const OrderDetails = ({ orderInfo } : DetailProps) => {
    console.log('orderInfo', orderInfo)
    return (
        <ScrollView style={styles.screen}>
            <Text style={styles.title}>Special Instructions: </Text>
            <Text>Instructions</Text>
            <View style={styles.userContainer}>
                <Text style={styles.title}>Medical User</Text>
                <Text style={styles.userDetails}>Date</Text>
                <Text style={styles.userDetails}>firstName lastName, phone#</Text>
                <Text style={styles.userDetails}>Identificatioon Document: id#</Text>
                <Text style={styles.userDetails}>Birth Date: Month day, Year</Text>
                <Text style={styles.userDetails}>Medical ID: id#</Text>
                <Text style={styles.userDetails}>address</Text>
            </View>
            <View style={styles.product}>
                <Text>Product</Text>
            </View>
            <View style={styles.priceDetails}>
                <Text>SubTotal</Text>
                <Text>price</Text>
            </View>
            <View style={styles.priceDetails}>
                <Text>State and Local Sales Tax: %</Text>
                <Text>price</Text>
            </View>
            <View style={styles.priceDetails}>
                <Text>Delivery Fee</Text>
                <Text>price</Text>
            </View>
            <View style={styles.priceDetails}>
                <Text>Total: Price</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button title='Cancel Order' onPress={() => console.log('cancel')} />
                <Button title='Complete Order' onPress={() => console.log('Complete')} />
            </View>
        </ScrollView>
    )
}

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
        padding: 10
    },
    title: {
        fontWeight: 'bold',
        padding: 10
    },
    userContainer: {
        marginTop: 20
    },
    userDetails: {
        padding: 10
    },
    priceDetails: {
        padding: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default OrderDetails;
