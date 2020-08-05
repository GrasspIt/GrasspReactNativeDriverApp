import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

import { useSelector, useDispatch } from "react-redux";
import { State, User, DsprDriver } from "../store/reduxStoreState";
import { getDSPRDriver, setDsprDriverId } from "../actions/driverActions";

import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import OnCallSwitch from '../components/OnCallSwitch';
import TopNavBar from '../components/TopNavBar';

type DashboardScreenNavigationProp = StackNavigationProp<DrawerStackParamsList, 'Dashboard'>;
type Props = {
    navigation: DashboardScreenNavigationProp;
    route;
}

const Dashboard = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const dispatch = useDispatch();

  const userId = useSelector<State, string>(state => state.api.loggedInUserId);
  const loggedInUser = useSelector<State, User>(state => state.api.entities.users[userId])
  const dsprDriver = useSelector<State, DsprDriver>(state => state.api.entities.dsprDrivers[driverId]);

  useEffect(() => {
    dispatch(setDsprDriverId(driverId));
    dispatch(getDSPRDriver(driverId));
  }, [driverId])

  return (
    loggedInUser && dsprDriver ? (
      <View style={styles.container}>
        <TopNavBar navigation={navigation}/>
        <View style={styles.body}>
          <Text style={styles.title}>
            Welcome {loggedInUser.firstName} {loggedInUser.lastName}!
          </Text>
          <OnCallSwitch dsprDriver={dsprDriver}/>
        </View>
      </View>
    ) : null
  )
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