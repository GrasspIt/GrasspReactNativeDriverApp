import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DSPRScreen from '../screens/DSPRScreen';
import StartupScreen from '../screens/StartupScreen';
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';

export type RootStackParamsList = {
  Startup: undefined,
  Login: undefined,
  DSPRs: { driverIds: number[] },
  Dashboard: { driverId: number }
}

const RootStack = createStackNavigator<RootStackParamsList>();

const ScreenNavigator = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen
              name="Startup"
              component={StartupScreen}
              options={{
                headerShown: false
              }}
          />
          <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false
              }}
          />
          <RootStack.Screen
              name="DSPRs"
              component={DSPRScreen}
              options={{
                headerShown: false
              }}
          />
          <RootStack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerShown: false
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default ScreenNavigator;