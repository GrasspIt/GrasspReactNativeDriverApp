import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
const Drawer = createDrawerNavigator();

const ScreenNavigator = () => {
    return (
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator initialRouteName="Startup">
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
        {/* <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="DSPRs" component={DSPRScreen} />
          <Drawer.Screen name="DSPRs" component={DSPRScreen} />
        </Drawer.Navigator> */}
      </NavigationContainer>
    );
  }
  
  export default ScreenNavigator;