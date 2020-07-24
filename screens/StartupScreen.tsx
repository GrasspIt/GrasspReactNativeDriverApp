import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from 'expo-secure-store';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Startup'>;
type Props = {
    navigation: LoginScreenNavigationProp;
}

const Startup = ({ navigation }: Props) => {

  const dispatch = useDispatch();

  // if a valid token is stored, login automatically
  useEffect(() => {
    const tryLogin = async () => {
        // check if there is a token stored
        const loginData = await SecureStore.getItemAsync('accessToken');
        console.log('loginData:', loginData);
        // if there is no token, navigate to login page
        if (!loginData) {
            navigation.navigate('Login');
            return;
        }
        // get login data
        const parsedData = JSON.parse(loginData);
        const { token, expiration } = parsedData;
        const expirationDate = new Date(expiration);
        // if the token has expired, nagivate to login page
        if (expirationDate <= new Date() || !token ) {
            navigation.navigate('Login');
            return;
        }
        // if the token hasn't expired, login and navigate to home page
        // autoLogin(token);
        navigation.navigate('Dashboard');
    };
    tryLogin();
}, []);

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