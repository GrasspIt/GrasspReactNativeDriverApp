import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../selectors/userSelectors';
import { setDsprDriverId } from '../actions/driverActions';
import { preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';

import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import { Alert } from 'react-native';

export type RootStackParamsList = {
  Login: undefined;
  Main: undefined;
};

const RootStack = createStackNavigator<RootStackParamsList>();

const AuthNavigator = ({
  driverId,
  loggedInUser,
  logout,
  setDsprDriverId,
  preloadAccessTokenFromLocalStorage,
}) => {
  useEffect(() => {
    preloadAccessTokenFromLocalStorage();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      if (!loggedInUser.dsprDrivers || loggedInUser.dsprDrivers.length < 1) {
        logout();
        Alert.alert('You must be a DSPR driver to use this app.');
      }
      if (!driverId && loggedInUser.dsprDrivers.length === 1) {
        setDsprDriverId(loggedInUser.dsprDrivers[0]);
      }
    }
  }, [loggedInUser, driverId]);

  return (
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
  );
};

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  const dsprDrivers = state.api.entities.dsprDrivers;
  const driverId = state.api.dsprDriverId;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
    dsprDrivers,
    isLoading,
  };
};

const mapDispatchToProps = { preloadAccessTokenFromLocalStorage, logout, setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(AuthNavigator);
