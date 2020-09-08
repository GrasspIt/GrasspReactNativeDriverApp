import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';
import { State, User } from '../store/reduxStoreState';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Startup'>;
type Props = {
  navigation: LoginScreenNavigationProp;
};

const Startup = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const userId = useSelector<State, string>((state) => state.api.loggedInUserId);
  const dsprDriver = useSelector<State, string>((state) => state.api.dsprDriverId);
  const loggedInUser = useSelector<State, User>((state) => state.api.entities.users[userId]);

  // if a valid token is stored, login automatically
  useEffect(() => {
    dispatch(preloadAccessTokenFromLocalStorage());
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser.dsprDrivers && !dsprDriver) {
      if (loggedInUser.dsprDrivers.length > 0) {
        navigation.navigate('Main', { dsprDrivers: loggedInUser.dsprDrivers });
      } else {
        dispatch(logout());
        navigation.navigate('Login');
      }
    }
  }, [loggedInUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Startup;
