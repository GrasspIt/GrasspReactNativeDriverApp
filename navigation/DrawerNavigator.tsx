import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DSPRScreen from '../screens/DSPRScreen';
import Dashboard from '../screens/Dashboard';

export type DrawerStackParamsList = {
  DSPRs: { driverIds: number[] },
  Dashboard: { driverId: number }
}

const Drawer = createDrawerNavigator<DrawerStackParamsList>();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName="DSPRs">
            <Drawer.Screen name="DSPRs" component={DSPRScreen} />
            <Drawer.Screen name="Dashboard" component={Dashboard} />
        </Drawer.Navigator>
    );
  }
  
  export default DrawerNavigator;