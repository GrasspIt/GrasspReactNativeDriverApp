import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../constants/Colors';

import { useSelector, useDispatch } from "react-redux";
import { State, User } from "../store/reduxStoreState";
import { getLoggedInUser } from "../selectors/userSelectors";
import { logout } from "../actions/oauthActions";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Dashboard'>;
type Props = {
    navigation: LoginScreenNavigationProp;
}

const Dashboard = ({ navigation }: Props) => {

  const dispatch = useDispatch();

  const loggedInUser = useSelector<State, User>(getLoggedInUser);
  console.log('loggedInUser:', loggedInUser)

  const handleLogout = () => {
    dispatch(logout);
    navigation.navigate('Login');
}

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'menu', color: Colors.light}}
        rightComponent={{ icon: 'logout', type: 'antdesign', color: Colors.light, onPress: handleLogout }}
        containerStyle={{
            backgroundColor: Colors.primary,
            borderBottomWidth: 0
        }}
      />
      <View style={styles.body}>
        <Text>Welcome {loggedInUser.firstName} {loggedInUser.lastName}!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Dashboard;