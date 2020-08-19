import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';

import StartupScreen from '../screens/StartupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OrderDetails from '../screens/OrderDetails';
import { Order } from '../store/reduxStoreState';

export type RootStackParamsList = {
  Startup: undefined;
  Login: undefined;
  Home: { dsprDrivers: number[] };
  Details: { orderInfo: Order };
};

const RootStack = createStackNavigator<RootStackParamsList>();

const ScreenNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator initialRouteName="Startup">
        <RootStack.Screen
          name="Startup"
          component={StartupScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Details"
          component={OrderDetails}
          options={{
            headerShown: true,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default ScreenNavigator;
