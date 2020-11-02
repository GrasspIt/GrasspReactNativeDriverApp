import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../selectors/userSelectors';
import { setDsprDriverId } from '../actions/driverActions';
import { preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import { Alert } from 'react-native';

export type RootStackParamsList = {
  Login: undefined;
  Main: any;
};

const RootStack = createStackNavigator<RootStackParamsList>();

const AuthNavigator = ({
  isLoading,
  dsprDrivers,
  loggedInUser,
  logout,
  setDsprDriverId,
  preloadAccessTokenFromLocalStorage,
}) => {
  const [appReady, setAppReady] = useState(false);

  const hideSplashScreen = async () => {
    setAppReady(true);
    await SplashScreen.hideAsync();
  };

  const checkForToken = async () => {
    await SplashScreen.preventAutoHideAsync();
    await preloadAccessTokenFromLocalStorage();
    hideSplashScreen();
  };

  useEffect(() => {
    checkForToken();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      if (!loggedInUser.dsprDrivers || loggedInUser.dsprDrivers.length < 1) {
        logout();
        Alert.alert('You must be a DSPR driver to use this app.');
      }
      if (loggedInUser.dsprDrivers.length === 1) {
        console.log('loggedInUser.dsprDrivers', loggedInUser.dsprDrivers);
        setDsprDriverId(loggedInUser.dsprDrivers[0]);
      }
      hideSplashScreen();
    }
  }, [loggedInUser]);

  return appReady ? (
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
  ) : null;
};

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  const dsprDrivers = state.api.entities.dsprDrivers;
  return {
    loggedInUser: getLoggedInUser(state),
    dsprDrivers,
    isLoading,
  };
};

const mapDispatchToProps = { preloadAccessTokenFromLocalStorage, logout, setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(AuthNavigator);
