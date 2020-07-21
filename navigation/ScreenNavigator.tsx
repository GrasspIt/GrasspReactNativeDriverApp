import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Startup from '../screens/Startup';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';

export type RootStackParamsList = {
  Startup: undefined,
  Login: undefined,
  Dashboard: undefined
}

const RootStack = createStackNavigator<RootStackParamsList>();

const ScreenNavigator = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen
              name="Startup"
              component={Startup}
          />
          <RootStack.Screen
              name="Login"
              component={Login}
          />
          <RootStack.Screen
            name="Dashboard"
            component={Dashboard}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default ScreenNavigator;