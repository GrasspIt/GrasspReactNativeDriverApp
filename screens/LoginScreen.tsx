import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout } from '../actions/oauthActions';
import { State, User } from '../store/reduxStoreState';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/ScreenNavigator';

import LoginForm from '../components/LoginForm';
import { Alert } from 'react-native';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const errorMessage = useSelector<State, string>((state) => state.api.errorMessage);
  const dsprDriver = useSelector<State, string>((state) => state.api.dsprDriverId);
  const userId = useSelector<State, string>((state) => state.api.loggedInUserId);
  const loggedInUser = useSelector<State, User>((state) => state.api.entities.users[userId]);

  useEffect(() => {
    if (!loggedInUser && errorMessage) {
      setIsLoading(false);
      Alert.alert(errorMessage);
    }
    if (loggedInUser && loggedInUser.dsprDrivers && !dsprDriver) {
      if (loggedInUser.dsprDrivers.length > 0) {
        setIsLoading(false);
        navigation.navigate('Dashboard', { dsprDrivers: loggedInUser.dsprDrivers });
      } else {
        dispatch(logout());
        setIsLoading(false);
        Alert.alert(
          'You must be a DSPR driver to use this app. You can sign up on the Grassp website.'
        );
      }
    }
  }, [loggedInUser, errorMessage]);

  const handleLogin = (username: string, password: string) => {
    setIsLoading(true);
    dispatch(attemptLogin(username, password));
  };

  return <LoginForm handleLogin={handleLogin} isLoading={isLoading} />;
};

export default LoginScreen;
