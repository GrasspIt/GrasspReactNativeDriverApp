import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import { Order } from "../store/reduxStoreState";
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

type OrderProps = { orderInfo: Order; }

const OrderItem = ({ orderInfo } : OrderProps) => {
    return (
        <View style={styles.orderContainer}>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 16}}>Name,</Text>
                    <Text style={{color: Colors.dark, marginLeft: 4}}>$price</Text>
                </View>
                <Text style={{color: Colors.dark, marginTop: 2}}>address</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Button buttonStyle={{backgroundColor: Colors.primary}} title='Details' onPress={() => Alert.alert('hello')}/>
                <MaterialCommunityIcons name='file-document-box-search-outline' color={Colors.primary} size={28}/>
                <Icon name='text-box-search-outline' type='MaterialCommunityIcons'/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.medium,
    }
});

export default OrderItem;