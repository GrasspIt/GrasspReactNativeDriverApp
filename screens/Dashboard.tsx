import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import { State, User, Order, DSPR } from '../store/reduxStoreState';
import {
  getDSPRDriver,
  setDsprDriverId,
  setDriverLocation,
  GET_DSPR_DRIVER_FAILURE,
} from '../actions/driverActions';
import { store } from '../store/store';

import { RootStackParamsList } from '../navigation/ScreenNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import OnCallSwitch from '../components/OnCallSwitch';
import TopNavBar from '../components/TopNavBar';
import { useInterval } from '../hooks/useInterval';
import OrderItem from '../components/OrderItem';
import DsprModal from '../components/DsprModal';
import { getOrders } from '../selectors/orderSelectors';
import { getDSPRs } from '../selectors/dsprSelectors';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Dashboard'>;
type Props = {
  navigation: DashboardScreenNavigationProp;
  route;
};

//initialize variable outside of component to be used in TaskManager below
let dsprDriver;

const Dashboard = ({ route, navigation }: Props) => {
  const { dsprDrivers } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = useSelector<State, string>((state) => state.api.loggedInUserId);
  const loggedInUser = useSelector<State, User>((state) => state.api.entities.users[userId]);
  const orders = useSelector<State, Order>(getOrders);
  const dsprs = useSelector<State, DSPR>(getDSPRs);
  const orderList = Object.values(orders);
  const dspr = dsprDriver
    ? Object.values(dsprs).filter((item) => item.id === dsprDriver.dspr)
    : null;

  const getDriverInfo = (id) => {
    dispatch(setDsprDriverId(id));
    dispatch<any>(getDSPRDriver(id)).then((response) => {
      if (response.type === GET_DSPR_DRIVER_FAILURE) {
        setError(response.error);
      } else {
        dsprDriver = response.response.entities.dsprDrivers[id];
        dsprDriver
          ? setError('')
          : setError('An unexpected error occurred when fetching driver info. Please try again.');
      }
      setIsLoading(false);
    });
  };

  // polling data from API while logged in
  const refreshData = () => {
    if (userId && dsprDriver) dispatch(getDSPRDriver(dsprDriver.id));
  };
  useInterval(refreshData, 60000);

  useEffect(() => {
    // refresh data when screen is focused
    if (isFocused) {
      setIsLoading(true);
      //check if there is more than one dsprDriver
      if (dsprDrivers.length > 1 && !dsprDriver) {
        setModalVisible(true);
      } else {
        getDriverInfo(dsprDrivers[0]);
      }
    }
  }, [navigation, dsprDrivers, dsprDriver, isFocused]);

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
      <TopNavBar
        dsprDrivers={dsprDrivers}
        setModalVisible={setModalVisible}
        navigation={navigation}
      />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <View style={styles.body}>
            <Text style={styles.title}>{dspr[0].name}</Text>
            <OnCallSwitch dsprDriver={dsprDriver} />
            <FlatList
              data={orderList}
              renderItem={(item) => <OrderItem orderInfo={item.item} />}
              keyExtractor={(item: any) => item.id.toString()}
              style={{ paddingHorizontal: 20, marginVertical: 20 }}
            />
            <DsprModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              getDriverInfo={getDriverInfo}
            />
          </View>
        )}
      </View>
    </>
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
