import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import DSPRScreen from '../screens/DSPRScreen';
import Dashboard from '../screens/Dashboard';
import { logout } from '../actions/oauthActions';
import { useDispatch } from 'react-redux';
import { DrawerActions } from '@react-navigation/native';
import * as RootNavigation from '../navigation/RootNavigation';
import Colors from '../constants/Colors';

export type DrawerStackParamsList = {
  DSPRs: { driverIds: number[] };
  Dashboard: { driverId: number };
};

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = ({ navigation, dsprDrivers }) => {
  const dispatch = useDispatch();
  console.log('dsprDrivers', dsprDrivers);

  const handleLogout = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('DSPRs');
    dispatch(logout());
    RootNavigation.navigate('Login', null);
  };

  return (
    <Drawer.Navigator
      // initialRouteName="DSPRs"
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
      {/* {dsprDrivers.length > 1 ? (
              <> */}
      <Drawer.Screen name="DSPRs" component={DSPRScreen} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      {/* </>
            ) : (
              <Drawer.Screen name="Dashboard" component={Dashboard} />
            )} */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
