import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import DSPRScreen from '../screens/DSPRScreen';
import { logout } from '../actions/oauthActions';
import { useDispatch } from 'react-redux';
import { DrawerActions } from '@react-navigation/native';
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
  DSPRs: { driverIds: number[] };
  Dashboard: { driverId: number };
};

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = ({ navigation, route }: Props) => {
  const { dsprDrivers } = route.params;

  const dispatch = useDispatch();

  const handleLogout = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (dsprDrivers.length > 1) RootNavigation.navigate('DSPRs', null);
    dispatch(logout());
    RootNavigation.navigate('Login', null);
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
