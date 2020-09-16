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
import * as Linking from 'expo-linking';
import * as RootNavigation from '../navigation/RootNavigation';
import Colors from '../constants/Colors';
import DashboardNavigator from './DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
  route;
};

export type DrawerStackParamsList = {
  DSPRs: any;
  Dashboard: any;
};

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();

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
        activeTintColor: Colors.light,
        activeBackgroundColor: Colors.primary,
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              labelStyle={{ fontSize: 16 }}
              onPress={() => handleLogout()}
            />
            <DrawerItem
              label="Contact Us"
              labelStyle={{ fontSize: 16 }}
              onPress={() => Linking.openURL('https://grassphealth.com/contact/')}
            />
            <DrawerItem
              label="Privacy Policy"
              labelStyle={{ fontSize: 16 }}
              onPress={() => Linking.openURL('https://grassphealth.com/grassp-privacy-policy/')}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      {dsprDrivers.length > 1 ? (
        <>
          <Drawer.Screen name="DSPRs" component={DSPRScreen} />
          <Drawer.Screen name="Dashboard" component={DashboardNavigator} />
        </>
      ) : (
        <Drawer.Screen
          name="Dashboard"
          component={DashboardNavigator}
          initialParams={{ driverId: dsprDrivers[0] }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
