import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { useSelector, useDispatch } from 'react-redux';
import { State, User, DsprDriver } from '../store/reduxStoreState';
import {
  getDSPRDriver,
  setDsprDriverId,
  setDriverLocation,
} from '../actions/driverActions';
import { store } from '../store/store';

import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import OnCallSwitch from '../components/OnCallSwitch';
import TopNavBar from '../components/TopNavBar';
import { useInterval } from '../hooks/useInterval';
import OrderQueue from '../components/OrderQueue';

type DashboardScreenNavigationProp = StackNavigationProp<
  DrawerStackParamsList,
  'Dashboard'
>;
type Props = {
  navigation: DashboardScreenNavigationProp;
  route;
};

//initialize variable outside of component to be used in TaskManager below
let dsprDriver;

const Dashboard = ({ route, navigation }: Props) => {
  const { driverId } = route.params;
  const dispatch = useDispatch();

  const userId = useSelector<State, string>(
    (state) => state.api.loggedInUserId
  );
  const loggedInUser = useSelector<State, User>(
    (state) => state.api.entities.users[userId]
  );
  dsprDriver = useSelector<State, DsprDriver>(
    (state) => state.api.entities.dsprDrivers[driverId]
  );

  const [isTracking, setIsTracking] = useState(false);

  // polling data from API while logged in
  const refreshData = () => {
    if (userId) dispatch(getDSPRDriver(driverId));
  };
  useInterval(refreshData, 60000);

  useEffect(() => {
    dispatch(setDsprDriverId(driverId));
    dispatch(getDSPRDriver(driverId));
  }, [driverId]);

  useEffect(() => {
    (async () => {
      //permissions for location tracking
      if (dsprDriver) {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied.');
        }
        //start location updates if driver is on call
        if (status === 'granted' && dsprDriver && dsprDriver.onCall) {
          console.log('location update');
          setIsTracking(true);
          await Location.startLocationUpdatesAsync('location-tracking', {
            timeInterval: 30000,
            distanceInterval: 0,
            foregroundService: {
              notificationTitle: 'Location Updates',
              notificationBody:
                'Grassp Health Driver App is tracking your current location.',
            },
            pausesUpdatesAutomatically: false,
          });
        }
      }
      //stop location updates if driver is not on call
      if (isTracking && !dsprDriver.onCall) {
        console.log('stop location updates');
        setIsTracking(false);
        await Location.stopLocationUpdatesAsync('location-tracking');
      }
    })();
  }, [dsprDriver, isTracking]);

  return loggedInUser && dsprDriver ? (
    <View style={styles.container}>
      <TopNavBar navigation={navigation} />
      <View style={styles.body}>
        <Text style={styles.title}>
          Welcome {loggedInUser.firstName} {loggedInUser.lastName}!
        </Text>
        <OnCallSwitch dsprDriver={dsprDriver} />
        <OrderQueue dsprDriver={dsprDriver} />
      </View>
    </View>
  ) : null;
};

// define the task that will be called with startLocationTrackingUpdates
TaskManager.defineTask('location-tracking', ({ data, error }) => {
  if (error) {
    console.log('Error: ', error.message);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    //dispatch location to api
    store.dispatch(setDriverLocation(dsprDriver.dspr, lat, long));
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
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 14,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
  },
});

export default Dashboard;
