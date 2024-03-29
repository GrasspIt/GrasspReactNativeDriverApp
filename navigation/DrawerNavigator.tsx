import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

import DSPRScreen from '../screens/DSPRScreen';
import { logout } from '../actions/oauthActions';
import { connect } from 'react-redux';

import { DrawerActions } from '@react-navigation/native';
// import * as Linking from 'expo-linking';
import * as RootNavigation from '../App';
import { useTheme } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import DashboardNavigator from './DashboardNavigator';
import RoutingNavigator from './RoutingNavigator';
import OrderListNavigator from './OrderListNavigator';
import { getDSPRDrivers } from '../selectors/dsprDriverSelector';
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

type MainScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Main'>;

type Props = {
    navigation: MainScreenNavigationProp;
    route;
    dsprDrivers;
    logout;
};

export type DrawerStackParamsList = {
    DSPRs: undefined;
    DashboardNav: undefined;
    RoutingNav: undefined;
    OrdersNav: undefined;
};

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = ({navigation, route, dsprDrivers, logout}: Props) => {
    const {colors} = useTheme();
    const drivers = Object.keys(dsprDrivers);

    const handleLogout = () => {
        navigation.dispatch(DrawerActions.closeDrawer());
        if (drivers.length > 1) RootNavigation.navigate('DSPRs', null);
        logout();
    };

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerActiveTintColor: colors.surface,
                drawerActiveBackgroundColor: colors.primary,
                drawerLabelStyle: {fontSize: 16},
                headerShown: false
            }}
            drawerContent={(props) => {
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <DrawerItem
                            label='Logout'
                            labelStyle={{fontSize: 16}}
                            onPress={() => handleLogout()}
                        />
                        {/* <DrawerItem
              label="Contact Us"
              labelStyle={{ fontSize: 16 }}
              onPress={() => Linking.openURL('https://grassphealth.com/contact/')}
            />
            <DrawerItem
              label="Privacy Policy"
              labelStyle={{ fontSize: 16 }}
              onPress={() => Linking.openURL('https://grassphealth.com/grassp-privacy-policy/')}
            /> */}
                    </DrawerContentScrollView>
                );
            }}
        >
            {drivers.length > 1 ? <Drawer.Screen name='DSPRs' component={DSPRScreen}/> : null}
            {/*Avoids nested screen names (the various navigators have 'Dashboard', 'Orders', and 'Routing' names)*/}
            <Drawer.Screen name='DashboardNav' options={{drawerLabel: 'Dashboard'}} component={DashboardNavigator}/>
            <Drawer.Screen name='OrdersNav' options={{drawerLabel: 'Orders'}} component={OrderListNavigator}/>
            <Drawer.Screen name='RoutingNav' options={{drawerLabel: 'Routing'}} component={RoutingNavigator}/>
        </Drawer.Navigator>
    );
};
const mapStateToProps = (state) => {
    return {
        dsprDrivers: getDSPRDrivers(state, null),
    };
};

const mapDispatchToProps = {logout};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigator);
