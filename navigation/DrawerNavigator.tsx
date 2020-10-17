import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import DSPRScreen from '../screens/DSPRScreen';
import { logout } from '../actions/oauthActions';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../store/reduxStoreState';

import { DrawerActions } from '@react-navigation/native';
// import * as Linking from 'expo-linking';
import * as RootNavigation from '../navigation/RootNavigation';
import { useTheme } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import DashboardNavigator from './DashboardNavigator';
import RoutingNavigator from './RoutingNavigator';
import OrderListNavigator from './OrderListNavigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
  route;
};

export type DrawerStackParamsList = {
  DSPRs: any;
  Dashboard: any;
  Routing: any;
  Orders: any;
};

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const dsprDriversObj = useSelector<State, any>((state) => state.api.entities.dsprDrivers);
  const dsprDrivers = Object.keys(dsprDriversObj);

  const handleLogout = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (dsprDrivers.length > 1) RootNavigation.navigate('DSPRs', null);
    dispatch(logout());
  };

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        labelStyle: { fontSize: 16 },
        activeTintColor: colors.surface,
        activeBackgroundColor: colors.primary,
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label='Logout'
              labelStyle={{ fontSize: 16 }}
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
      {dsprDrivers.length > 1 ? <Drawer.Screen name='DSPRs' component={DSPRScreen} /> : null}
      <Drawer.Screen name='Dashboard' component={DashboardNavigator} />
      <Drawer.Screen name='Orders' component={OrderListNavigator} />
      <Drawer.Screen name='Routing' component={RoutingNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
