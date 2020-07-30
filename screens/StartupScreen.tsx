import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from 'expo-secure-store';
import { updateLoggedInUserInfo } from '../actions/oauthActions';
import { State, User } from "../store/reduxStoreState";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Startup'>;
type Props = {
    navigation: LoginScreenNavigationProp;
}

const Startup = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const userId = useSelector<State, string>(state => state.api.loggedInUserId);
  const dsprDriver = useSelector<State, string>(state => state.api.dsprDriverId);
  const loggedInUser = useSelector<State, User>(state => state.api.entities.users[userId])

  // if a valid token is stored, login automatically
  useEffect(() => {
    const tryLogin = async () => {
        // check if there is a token stored
        const loginData = await SecureStore.getItemAsync('accessToken');
        // if there is no token, navigate to login page
        if (!loginData) {
          navigation.navigate('Login');
          return;
        }
        // if there is a token, get user info
        dispatch(updateLoggedInUserInfo());
    };
    tryLogin();
  }, []);
  
  useEffect(() => {
    if (loggedInUser && loggedInUser.dsprDrivers && !dsprDriver) {
        if (loggedInUser.dsprDrivers.length > 1) {
            navigation.navigate('DSPRs', { driverIds: loggedInUser.dsprDrivers })
        } else {
            navigation.navigate('Dashboard', { driverId: loggedInUser.dsprDrivers[0] });
        }
    }
  }, [loggedInUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Startup;