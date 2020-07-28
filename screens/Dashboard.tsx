import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../constants/Colors';

import { useSelector, useDispatch } from "react-redux";
import { State, User, DsprDriver } from "../store/reduxStoreState";
import { getLoggedInUser } from "../selectors/userSelectors";
import { logout } from "../actions/oauthActions";
import { getDSPRDriver } from "../actions/driverActions";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Dashboard'>;
type Props = {
    navigation: LoginScreenNavigationProp;
    route;
}

const Dashboard = ({ route, navigation }: Props) => {
  // refactor to manage switch state based on redux store
  const { driverId } = route.params;
  const dsprDriver = useSelector<State, DsprDriver>(state => state.api.entities.dsprDrivers[driverId]);
  const loggedInUser = useSelector<State, User>(getLoggedInUser);
  
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(dsprDriver.onCall);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    dispatch(getDSPRDriver(driverId));
  }, [driverId])

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
}

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: 'menu',
          color: Colors.black,
          onPress: () => Alert.alert('This button does nothing yet.')
        }}
        rightComponent={{
          icon: 'logout',
          type: 'antdesign',
          color: Colors.black,
          onPress: () => handleLogout()
        }}
        centerComponent={<Text style={{fontSize: 20}}>Grassp Health</Text>}
        containerStyle={{
            backgroundColor: Colors.light,
            borderBottomWidth: 2,
            borderBottomColor: Colors.medium
        }}
      />
      <View style={styles.body}>
        <Text style={styles.title}>
          Welcome {loggedInUser.firstName} {loggedInUser.lastName}!
        </Text>
        <Switch
          trackColor={{ false: Colors.red, true: Colors.green }}
          thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>{isEnabled? 'On Call' : 'Not on Call'}</Text>
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
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 20
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Dashboard;