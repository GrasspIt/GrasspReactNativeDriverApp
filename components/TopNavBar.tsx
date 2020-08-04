import React from 'react';
import { StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../constants/Colors';
import { logout } from "../actions/oauthActions";
import { useSelector, useDispatch } from "react-redux";
import * as RootNavigation from '../navigation/RootNavigation';
import { DrawerActions } from '@react-navigation/native';


const TopNavBar = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        RootNavigation.navigate('Login', null);
    }

    return (
        <Header
            leftComponent={{
            icon: 'menu',
            color: Colors.black,
            onPress: () => DrawerActions.toggleDrawer()
        }}
        rightComponent={{
            icon: 'logout',
            type: 'antdesign',
            color: Colors.black,
            onPress: () => handleLogout()
        }}
        centerComponent={<Text style={{fontSize: 20}}>Grassp Health</Text>}
        containerStyle={{
            backgroundColor: Colors.light,
            borderBottomWidth: 2,
            borderBottomColor: Colors.medium
        }}
    />
)}

export default TopNavBar;