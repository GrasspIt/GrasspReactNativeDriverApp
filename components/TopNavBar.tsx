import React from 'react';
import { Header, Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { logout } from "../actions/oauthActions";
import { useDispatch } from "react-redux";
import * as RootNavigation from '../navigation/RootNavigation';

const TopNavBar = ({navigation}) => {
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
                onPress: () => navigation.toggleDrawer()
            }}
            rightComponent={{
                icon: 'logout',
                type: 'antdesign',
                color: Colors.black,
                onPress: () => handleLogout()
            }}
            centerComponent={
                <Image
                    source={require('../assets/grassp_health.png')}
                    style={{height: 40, width: 200}}
                />
            }
            containerStyle={{
                backgroundColor: Colors.light,
                borderBottomWidth: 2,
                borderBottomColor: Colors.medium
            }}
        />
)}

export default TopNavBar;