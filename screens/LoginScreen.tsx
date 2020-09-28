import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { attemptLogin, logout } from '../actions/oauthActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { setDsprDriverId } from '../actions/driverActions';
import * as RootNavigation from '../navigation/RootNavigation';
import LoginForm from '../components/LoginForm';
import { getLoggedInUser } from '../selectors/userSelectors';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
  navigation: LoginScreenNavigationProp;
  loggedInUser;
  errorMessage;
  driverId;
  logout;
  setDsprDriverId;
  attemptLogin;
};

const LoginScreen = ({
  navigation,
  loggedInUser,
  errorMessage,
  driverId,
  logout,
  setDsprDriverId,
  attemptLogin,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (username: string, password: string) => {
    setIsLoading(true);
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
    if (!loggedInUser && errorMessage) {
      setIsLoading(false);
      Alert.alert(errorMessage);
    }
    if (loggedInUser && loggedInUser.dsprDrivers && !driverId) {
      if (loggedInUser.dsprDrivers.length > 0) {
        setIsLoading(false);
        handleNavigate();
      } else {
        logout();
        setIsLoading(false);
        Alert.alert(
          'You must be a DSPR driver to use this app. You can sign up on the Grassp website.'
        );
      }
    }
  }, [loggedInUser, errorMessage]);

  return <LoginForm handleLogin={handleLogin} isLoading={isLoading} />;
};

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const errorMessage = state.api.errorMessage;
  return {
    loggedInUser: getLoggedInUser(state),
    errorMessage,
    driverId,
  };
};

const mapDispatchToProps = { logout, setDsprDriverId, attemptLogin };

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
