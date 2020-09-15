import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useInterval } from '../hooks/useInterval';
import { useDispatch, connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import {
  getDSPRDriver,
  setDriverLocation,
  GET_DSPR_DRIVER_FAILURE,
} from '../actions/driverActions';
import { store } from '../store/store';

import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import OnCallSwitch from '../components/OnCallSwitch';
import TopNavBar from '../components/TopNavBar';
import OrderItem from '../components/OrderItem';
import { getDSPRFromProps } from '../selectors/dsprSelectors';
import { logout } from '../actions/oauthActions';
import { getDSPRDriverWithUserAndOrdersFromProps } from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';

type HomeScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Home'>;
type Props = {
  navigation: HomeScreenNavigationProp;
  loggedInUser;
  dsprDrivers;
  dspr;
  driverId;
  dsprDriver;
};

const HomeScreen = ({
  navigation,
  driverId,
  loggedInUser,
  dsprDrivers,
  dspr,
  dsprDriver,
}: Props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getDriverInfo = () => {
    dispatch<any>(getDSPRDriver(driverId)).then((response) => {
      if (response.type === GET_DSPR_DRIVER_FAILURE) {
        Alert.alert('Error', 'Failed to fetch driver info. Try again?', [
          { text: 'No', onPress: () => dispatch(logout()) },
          { text: 'Yes', onPress: () => getDriverInfo() },
        ]);
      } else {
        dsprDriver
          ? setError('')
          : setError('An unexpected error occurred when fetching driver info. Please try again.');
      }
      setIsLoading(false);
    });
  };

  // polling data from API while logged in
  const refreshData = () => {
    if (loggedInUser) dispatch(getDSPRDriver(driverId));
  };
  useInterval(refreshData, 60000);

  useEffect(() => {
    setIsLoading(true);
    getDriverInfo();
  }, []);

  useEffect(() => {
    (async () => {
      //permissions for location tracking
      if (dsprDriver !== undefined) {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied.');
        }
        //start location updates if driver is on call
        if (status === 'granted' && dsprDriver !== undefined && dsprDriver.onCall) {
          console.log('start location updates');
          setIsTracking(true);
          await Location.startLocationUpdatesAsync('location-tracking', {
            timeInterval: 30000,
            distanceInterval: 0,
            foregroundService: {
              notificationTitle: 'Location Updates',
              notificationBody: 'Grassp Health Driver App is tracking your current location.',
            },
            pausesUpdatesAutomatically: false,
          });
        }
      }
      //stop location updates if driver is not on call
      if (isTracking && dsprDriver && !dsprDriver.onCall) {
        console.log('stop location updates');
        setIsTracking(false);
        await Location.stopLocationUpdatesAsync('location-tracking');
      }
    })();
  }, [dsprDriver, isTracking]);

  return loggedInUser && dsprDriver ? (
    <>
      <TopNavBar dsprName={dspr.name} navigation={navigation} />
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      ) : (
        <View style={styles.body}>
          <OnCallSwitch dsprDriver={dsprDriver} />
          <OrderItem orderInfo={dsprDriver.currentInProcessOrder} navigation={navigation} />
          <FlatList
            data={dsprDriver.queuedOrders}
            renderItem={(item) => <OrderItem orderInfo={item.item} navigation={navigation} />}
            keyExtractor={(item: any) => item.id.toString()}
            style={styles.orders}
          />
        </View>
      )}
    </>
  ) : null;
};

// define the task that will be called with startLocationTrackingUpdates
TaskManager.defineTask('location-tracking', ({ data, error }) => {
  console.log('call location update');
  const movingDriverId = store.getState().api.dsprDriverId;
  const movingDsprDriver = store.getState().api.entities.dsprDrivers[movingDriverId];
  if (error) {
    console.log('Error: ', error.message);
    return;
  }
  if (data) {
    console.log('location update');
    const { locations } = data as any;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    //dispatch location to api
    store.dispatch(setDriverLocation(movingDsprDriver.dspr, lat, long));
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  orders: {
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersFromProps(state, { dsprDriverId: driverId });
  const dsprDrivers = state.api.entities.dsprDrivers;
  const dspr = dsprDriver ? getDSPRFromProps(state, { dsprId: dsprDriver.dspr }) : undefined;
  return { loggedInUser: getLoggedInUser(state), driverId, dsprDrivers, dspr, dsprDriver };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
