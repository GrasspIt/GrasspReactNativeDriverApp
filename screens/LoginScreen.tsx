import React, { useEffect, useState } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { attemptLogin, preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { setDsprDriverId } from '../actions/driverActions';
import * as RootNavigation from '../navigation/RootNavigation';
import LoginForm from '../components/LoginForm';
import { getLoggedInUser } from '../selectors/userSelectors';
import { useTheme } from 'react-native-paper';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
  navigation: LoginScreenNavigationProp;
  loggedInUser;
  errorMessage;
  driverId;
  logout;
  setDsprDriverId;
  preloadAccessTokenFromLocalStorage;
  attemptLogin;
  isLoading;
};

const LoginScreen = ({
  navigation,
  loggedInUser,
  errorMessage,
  driverId,
  logout,
  setDsprDriverId,
  preloadAccessTokenFromLocalStorage,
  attemptLogin,
  isLoading,
}: Props) => {
  const { colors } = useTheme();

  const handleLogin = (username: string, password: string) => {
    attemptLogin(username, password);
  };

  const handleNavigate = () => {
    if (loggedInUser && loggedInUser.dsprDrivers && loggedInUser.dsprDrivers.length === 1) {
      setDsprDriverId(loggedInUser.dsprDrivers[0]);
    }
    if (loggedInUser && loggedInUser.dsprDrivers && loggedInUser.dsprDrivers.length > 1) {
      RootNavigation.navigate('Main', { screen: 'DSPRs' });
    }
  };

  useEffect(() => {
    if (!loggedInUser && !errorMessage) {
      preloadAccessTokenFromLocalStorage();
    }
    if (!loggedInUser && errorMessage) {
      Alert.alert(errorMessage);
    }
    if (loggedInUser && loggedInUser.dsprDrivers && !driverId) {
      if (loggedInUser.dsprDrivers.length > 0) {
        handleNavigate();
      } else {
        logout();
        Alert.alert(
          'You must be a DSPR driver to use this app. You can sign up on the Grassp website.'
        );
      }
    }
  }, [loggedInUser, errorMessage]);

  return isLoading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size='large' color={colors.primary} />
    </View>
  ) : (
    <LoginForm handleLogin={handleLogin} isLoading={isLoading} />
  );
};

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const errorMessage = state.api.errorMessage;
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    errorMessage,
    driverId,
    isLoading,
  };
};

const mapDispatchToProps = {
  preloadAccessTokenFromLocalStorage,
  logout,
  setDsprDriverId,
  attemptLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
