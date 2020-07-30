import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

import { useSelector, useDispatch } from "react-redux";
import { State, User, DsprDriver } from "../store/reduxStoreState";
import { getDSPRDriver, setDsprDriverId } from "../actions/driverActions";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';
import TopNavBar from '../components/TopNavBar';
import OnCallSwitch from '../components/OnCallSwitch';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Dashboard'>;
type Props = {
    navigation: LoginScreenNavigationProp;
    route;
}

const Dashboard = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const dispatch = useDispatch();

  const userId = useSelector<State, string>(state => state.api.loggedInUserId);
  const loggedInUser = useSelector<State, User>(state => state.api.entities.users[userId])
  const dsprDriver = useSelector<State, DsprDriver>(state => state.api.entities.dsprDrivers[driverId]);
  
  let dsprDriverInfo;
  if (dsprDriver) {
    dsprDriverInfo = dsprDriver;
  }

  let loggedInUserInfo;
  if (loggedInUser) {
    loggedInUserInfo = loggedInUser;
  }

  useEffect(() => {
    dispatch(setDsprDriverId(driverId));
    dispatch(getDSPRDriver(driverId));
  }, [driverId])

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.body}>
        <Text style={styles.title}>
          Welcome {loggedInUserInfo.firstName} {loggedInUserInfo.lastName}!
        </Text>
        <OnCallSwitch dsprDriverInfo={dsprDriverInfo}/>
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