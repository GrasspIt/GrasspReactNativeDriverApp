import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { State, Order, Address } from "../store/reduxStoreState";
import { useSelector, useDispatch } from "react-redux";
import Colors from '../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { getAddresses } from '../selectors/addressSelectors';
import { getUsers } from '../selectors/userSelectors';


type OrderProps = { orderInfo: Order; }

const OrderItem = ({ orderInfo } : OrderProps) => {

    const addresses = useSelector<State, Address>(getAddresses);
    const addressList = Object.values(addresses);
    const address = addressList.find(address => address.id === orderInfo.address);
    
    const users = useSelector<State, Address>(getUsers);
    const userList = Object.values(users);
    const user = userList.find(user => user.id === orderInfo.user);
    console.log({address})

    return (
        <View style={styles.orderContainer}>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 14}}>
                        {user.firstName} {user.lastName},
                    </Text>
                    <Text style={{color: Colors.dark, marginLeft: 4, fontSize: 12}}>
                        ${orderInfo.cashTotal}
                    </Text>
                </View>
                <Text style={{color: Colors.dark, marginTop: 2, fontSize: 12}}>
                    {address.street} {address.zipCode}
                </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{marginHorizontal: 30}}
                    onPress={() => Alert.alert('hello')}
                >
                    <Entypo name="info-with-circle" size={24} color={Colors.primary} />   
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('hello')}>
                    <FontAwesome name="gear" size={26} color={Colors.primary} />
                </TouchableOpacity>

                {/* <FontAwesome.Button
                    name="gear"
                    size={20}
                    backgroundColor={Colors.primary}
                    onPress={() => Alert.alert('hello')}
                >
                    Process
                </FontAwesome.Button> */}
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