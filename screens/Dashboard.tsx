import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { useSelector, useDispatch } from "react-redux";
import { State, User, DsprDriver } from "../store/reduxStoreState";
import { getDSPRDriver, setDsprDriverId, setDriverLocation } from "../actions/driverActions";
import { store } from '../store/store';

import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import OnCallSwitch from '../components/OnCallSwitch';
import TopNavBar from '../components/TopNavBar';
import { useInterval } from '../hooks/useInterval';

type DashboardScreenNavigationProp = StackNavigationProp<DrawerStackParamsList, 'Dashboard'>;
type Props = {
    navigation: DashboardScreenNavigationProp;
    route;
}

let dsprDriver;

const Dashboard = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const dispatch = useDispatch();

  const userId = useSelector<State, string>(state => state.api.loggedInUserId);
  const loggedInUser = useSelector<State, User>(state => state.api.entities.users[userId])
  dsprDriver = useSelector<State, DsprDriver>(state => state.api.entities.dsprDrivers[driverId]);

  // polling data from API while logged in
  const refreshData = () => {
    dispatch(getDSPRDriver(driverId));
  }
  useInterval(refreshData, 60000);

  useEffect(() => {
    dispatch(setDsprDriverId(driverId));
    dispatch(getDSPRDriver(driverId));
  }, [driverId])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied.');
      }
      if (status === 'granted' && dsprDriver.onCall) {
        console.log('start location updates');
        await Location.startLocationUpdatesAsync('location-tracking', {
            timeInterval: 5000,
            foregroundService: {
              notificationTitle: 'Location Updates',
              notificationBody: 'Grassp Health Driver App is tracking your current location.'
            },
            pausesUpdatesAutomatically: false
          });
      }
    })();
  }, [dsprDriver]);

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

TaskManager.defineTask('location-tracking', ({ data, error }) => {
  if (error) {
    console.log('Error: ', error.message);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('Locations: ', locations)
    //dispatch location to api
    store.dispatch(setDriverLocation(dsprDriver.dspr, locations[0].coords.latitude, locations[0].coords.longitude));
    console.log('dsprId: ', dsprDriver.dspr);
  }
});

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