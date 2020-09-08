import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import OrderDetails from '../screens/OrderDetails';
import { Order } from '../store/reduxStoreState';

export type DashboardStackParamsList = {
  Home: { driverId: number };
  Details: { orderInfo: Order };
};

const DashboardStack = createStackNavigator<DashboardStackParamsList>();

const DashboardNavigator = ({ driverId }) => {
  return (
    <DashboardStack.Navigator screenOptions={{ gestureEnabled: false }}>
      <DashboardStack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ driverId }}
        options={{
          headerShown: false,
        }}
      />
      <DashboardStack.Screen
        name="Details"
        component={OrderDetails}
        options={{
          headerShown: true,
        }}
      />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
