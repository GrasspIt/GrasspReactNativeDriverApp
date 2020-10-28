import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../selectors/userSelectors';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';

export type RootStackParamsList = {
  Login: undefined;
  Main: any;
};

const RootStack = createStackNavigator<RootStackParamsList>();

const AuthNavigator = ({ isLoading, loggedInUser }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
        {!loggedInUser ? (
          <RootStack.Screen
            name='Login'
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <RootStack.Screen
            name='Main'
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    isLoading,
  };
};

export default connect(mapStateToProps, null)(AuthNavigator);
