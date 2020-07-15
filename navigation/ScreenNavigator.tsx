import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Startup from '../screens/Startup';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';

const Stack = createStackNavigator();

const ScreenNavigator = () => {

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Startup"
              component={Startup}
          />
          <Stack.Screen
              name="Login"
              component={Login}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default ScreenNavigator;