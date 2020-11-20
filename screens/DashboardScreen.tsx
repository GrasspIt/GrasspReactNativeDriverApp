import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, Platform, SafeAreaView } from 'react-native';
import { Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as RootNavigation from '../navigation/RootNavigation';

import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { sendPushToken } from '../actions/userActions';
import { refreshDSPRDriver, getDSPRDriver, setDriverLocation } from '../actions/driverActions';
import { connect } from 'react-redux';
import { store } from '../store/store';
import { useInterval } from '../utils/useInterval';

import OnCallSwitch from '../components/OnCallSwitch';

import { getDSPRFromProps } from '../selectors/dsprSelectors';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';

// handler for push notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type DashboardScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Dashboard'>;
type Props = {
  navigation: DashboardScreenNavigationProp;
  dspr;
  driverId;
  dsprDriver;
  isLoading;
  pushToken;
  refreshDSPRDriver;
  getDSPRDriver;
  sendPushToken;
};

const DashboardScreen = ({
  navigation,
  driverId,
  dspr,
  dsprDriver,
  isLoading,
  pushToken,
  refreshDSPRDriver,
  getDSPRDriver,
  sendPushToken,
}: Props) => {
  const notificationListener: any = useRef();
  const responseListener: any = useRef();
  const { colors } = useTheme();
  const [notification, setNotification] = useState<any>(false);

  // polling data from API while logged in
  const refreshDriverData = () => {
    if (!isLoading && driverId) refreshDSPRDriver(driverId);
  };
  useInterval(refreshDriverData, 60000);

  const getDriverData = () => {
    if (driverId) getDSPRDriver(driverId);
  };

  useEffect(() => {
    getDriverData();
  }, [driverId]);

  // push notifications
  useEffect(() => {
    // get push token if none is stored
    if (!pushToken || !pushToken.isCurrent) {
      registerForPushNotificationsAsync().then((token) => {
        sendPushToken(token);
      });
    }
    // listen for when a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    // listen for when a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        await getDriverData();
        RootNavigation.navigate('Main', {
          screen: 'Orders',
          params: {
            screen: 'Details',
            params: {
              orderId: response.notification.request.content.data.orderId,
            },
          },
        });
      }
    );
    // listener cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [notification, notificationListener, responseListener]);

  const startLocationUpdates = async () => {
    console.log('start location updates');
    await Location.startLocationUpdatesAsync('location-tracking', {
      distanceInterval: 1200,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Location Updates',
        notificationBody: 'Grassp Health Driver App is tracking your current location.',
      },
      pausesUpdatesAutomatically: false,
    });
  };

  const stopLocationUpdates = async () => {
    console.log('stop location updates');
    await Location.stopLocationUpdatesAsync('location-tracking');
  };

  const toggleLocationUpdates = async () => {
    //see if location is already being tracked
    let tracking = await Location.hasStartedLocationUpdatesAsync('location-tracking');
    console.log('tracking', tracking);
    if (dsprDriver) {
      //permissions for location tracking
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted' && dsprDriver.onCall === true) {
        Alert.alert(
          'Location updates are disabled. Please go to device Settings and give Grassp Driver App permission to track your location.'
        );
      }
      //start updates if onCall, stop updates if not
      if (status === 'granted' && !tracking && dsprDriver.onCall === true) startLocationUpdates();
      if (tracking && dsprDriver.onCall === false) stopLocationUpdates();
    }
    if (tracking && !dsprDriver) stopLocationUpdates();
  };

  let oncallState = dsprDriver && dsprDriver.onCall;
  useEffect(() => {
    toggleLocationUpdates();
  }, [oncallState]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : dsprDriver ? (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Text style={styles.dsprTitle}>{dspr.name}</Text>
          {dsprDriver && <OnCallSwitch dsprDriver={dsprDriver} />}
        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text>Unable to fetch driver data.</Text>
          <Button mode='text' onPress={getDriverData}>
            Try Again
          </Button>
        </View>
      )}
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dsprTitle: {
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 20,
  },
});

// get permission for push notifications and set token
const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert(
        'Failed to register for push notifications! Go into your device Settings to give this app permission to send push notifications.'
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
};

// define the task that will be called with startLocationTrackingUpdates
TaskManager.defineTask('location-tracking', ({ data, error }) => {
  console.log('call location update');
  const movingDriverId = store.getState().api.dsprDriverId;
  const movingDsprDriver = store.getState().api.entities.dsprDrivers[movingDriverId];
  if (error) {
    Alert.alert('Error: ', error.message);
    return;
  }
  if (data && movingDsprDriver) {
    const { locations } = data as any;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    //dispatch location to api
    store.dispatch<any>(setDriverLocation(movingDsprDriver.dspr, lat, long));
  }
});

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: driverId,
  });
  const dspr = dsprDriver ? getDSPRFromProps(state, { dsprId: dsprDriver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  const pushToken = state.api.entities.pushToken;
  return {
    driverId,
    dspr,
    dsprDriver,
    isLoading,
    pushToken,
  };
};

const mapDispatchToProps = { refreshDSPRDriver, getDSPRDriver, sendPushToken };

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
