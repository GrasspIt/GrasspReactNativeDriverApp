import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

const Startup = () => {

//   // if a valid token is stored, login automatically
//   useEffect(() => {
//     const tryLogin = async () => {
//         // check if there is a token stored
//         const loginData = await AsyncStorage.getItem('loginData');
//         // if there is no token, navigate to login page
//         if (!loginData) {
//             navigation.navigate('Login');
//             return;
//         }
//         // get login data
//         const parsedData = JSON.parse(loginData);
//         const { token, expiration } = parsedData;
//         const expirationDate = new Date(expiration);
//         // if the token has expired, nagivate to login page
//         if (expirationDate <= new Date() || !token ) {
//             navigation.navigate('Login');
//             return;
//         }
//         // if the token hasn't expired, login and navigate to home page
//         autoLogin(token);
//         navigation.navigate('Home');
//     };
//     tryLogin();
// }, []);

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