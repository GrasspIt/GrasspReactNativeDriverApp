import React, { useEffect, useState, useRef} from 'react';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as RootNavigation from '../App';

import { sendPushToken } from '../actions/userActions';
import {
  refreshDSPRDriver,
  getDSPRDriver,
  setDriverLocation,
  setDriverOnCallState,
  SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
} from '../actions/driverActions';
import { connect } from 'react-redux';
import { store } from '../store/store';
import { useInterval } from '../utils/useInterval';
import { getDSPRFromProps } from '../selectors/dsprSelectors';
import { getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps } from '../selectors/dsprDriverSelector';
import DashboardDisplay from '../components/DashboardDisplay';

import { appendLocationHistory, updateLastLocationUpdate } from '../actions/locationActions';
import { getSessionLocations, getLastUpdateTime } from '../selectors/locationSelectors';

// handler for push notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const handleLocationUpdate = (data, error) => {
  const movingDriverId = store.getState().api.dsprDriverId;
  const movingDsprDriver = store.getState().api.entities.dsprDrivers[movingDriverId];
  const time = new Date();
  
  if (error) {
    store.dispatch<any>(appendLocationHistory({ dspr: movingDsprDriver.dspr, error, time}))
    Alert.alert('Error: ', error.message);
    return;
  }
  if (data && movingDsprDriver) {
    const { locations } = data as any;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    store.dispatch<any>(updateLastLocationUpdate())
    store.dispatch<any>(appendLocationHistory({ dspr: movingDsprDriver.dspr, lat, long, time}))
    //dispatch location to api
    store.dispatch<any>(setDriverLocation(movingDsprDriver.dspr, lat, long));
  }
}

type Props = {
  dspr;
  driverId;
  dsprDriver;
  isLoading;
  isDemo;
  pushToken;
  refreshDSPRDriver;
  getDSPRDriver;
  sendPushToken;
  setDriverOnCallState;
  sessionLocations;
  lastLocationUpdateTime;
};

const DashboardScreen = ({
  driverId,
  dspr,
  dsprDriver,
  isLoading,
  isDemo,
  pushToken,
  refreshDSPRDriver,
  getDSPRDriver,
  sendPushToken,
  setDriverOnCallState,
  sessionLocations,
  lastLocationUpdateTime
}: Props) => {
  const notificationListener: any = useRef();
  const responseListener: any = useRef();
  const [notification, setNotification] = useState<any>(false);
  const [showLocationPermissionAlert, setShowLocationPermissionAlert] = useState<boolean>(false);
  const [locationPermissionAlertTitle, setLocationPermissionAlertTitle] = useState<string>('');
  const [locationPermissionAlertText, setLocationPermissionAlertText] = useState<string>('');
  const [timeSinceLastUpdateString, setTimeSinceLastUpdateString] = useState<string>('');
  const [timeSinceLastUpdateInterval, setTimeSinceLastUpdateInterval] = useState<NodeJS.Timeout | undefined>(undefined);
  const [showSessionLocations, setShowSessionLocations] = useState<boolean>(false);
  const [foregroundLocationStatus, requestForegroundLocationPermission, getForegroundLocationPermission] = Location.useForegroundPermissions();
  const [backgroundLocationStatus, requestBackgroundLocationPermission, getBackgroundLocationPermission] = Location.useBackgroundPermissions();

  const closeLocationPermissionAlert = () => {
    setShowLocationPermissionAlert(false);
    setLocationPermissionAlertTitle('');
    setLocationPermissionAlertText('');
  }


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
        if(!isDemo) sendPushToken(token);
      });
    }
    // listen for when a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    // listen for when a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async () => {
        await getDriverData();
        RootNavigation.navigate('Main', {
          screen: 'OrdersNav',
        });
      }
    );
    // listener cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [notification, notificationListener, responseListener]);

  const msToTime = () => {
    if(!lastLocationUpdateTime) {
      setTimeSinceLastUpdateString("");
      return;
    } else {
      const currentTime = new Date();
      const diffTime = Math.abs(currentTime.valueOf() - lastLocationUpdateTime.valueOf());
      const diffDays = Math.floor(diffTime / (1000*60*60*24))
      const diffHours = Math.floor(diffTime / (1000*60*60)) % 24;
      const diffMinutes = Math.floor(diffTime / (1000 * 60)) % 60;
      const diffSeconds = Math.floor(diffTime / (1000)) % 60;
      let timeString = "";
  
      if(diffDays){
        timeString += diffDays + " Days";
        if(diffHours) timeString += (" " + diffHours + " Hours");
      } else {
        if(diffHours) timeString += (" " + diffHours + " " + "Hours");
        if(diffMinutes) timeString += (" " + diffMinutes + " " + "Minutes");
        if(diffSeconds) timeString += (" " + diffSeconds + " " + "Seconds");
      }
      setTimeSinceLastUpdateString(timeString);
    }
  }   

  const startLocationUpdates = async () => {
    await Location.startLocationUpdatesAsync('location-tracking', {
      distanceInterval: 120, //meters between updates, about .25 miles
      //distanceInterval: 1, //meters between updates, about .25 miles
      deferredUpdatesInterval: 300000, //milliseconds between batched updates when app is backgrounded, every 5 minutes
      //deferredUpdatesInterval: 60, //milliseconds between batched updates when app is backgrounded, every 5 minutes
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Location Updates',
        notificationBody: 'Grassp Health Driver App is tracking your current location.',
      },
      pausesUpdatesAutomatically: false,
    });
  };

  const stopLocationUpdates = async () => {
    await Location.stopLocationUpdatesAsync('location-tracking');
  };

  const toggleLocationUpdates = async () => {
    //see if location is already being tracked
    let tracking = await Location.hasStartedLocationUpdatesAsync('location-tracking');

    if (dsprDriver || isDemo) {
        //request foreground location permissions. If denied, show alert
      if(!foregroundLocationStatus) await getForegroundLocationPermission();
      if(!foregroundLocationStatus?.granted) await requestForegroundLocationPermission();

      if (foregroundLocationStatus && !foregroundLocationStatus?.granted && dsprDriver.onCall === true) {
        setShowLocationPermissionAlert(true);
        setLocationPermissionAlertTitle('Location updates are disabled.');
        setLocationPermissionAlertText('Please go to device Settings and give Grassp Driver App permission to Always track your location (With "Fine" accuracy if Android). \n\nAfterwards, quit and reopen the app.');   
      }

      //request background permissions. If denied, show alert
      if(!backgroundLocationStatus) await getBackgroundLocationPermission();
      if(!backgroundLocationStatus?.granted) await requestBackgroundLocationPermission();
      if(backgroundLocationStatus && !backgroundLocationStatus.granted && dsprDriver.onCall === true) {
        setShowLocationPermissionAlert(true);
        setLocationPermissionAlertTitle('Background location updates are disabled.');
        setLocationPermissionAlertText(`Background location updates are required for the app to work correctly. \n\nPlease go to device Settings and set the Grassp Driver App location permission to "${Platform.OS === 'ios' ? 'Always' : 'Allow all the time'}". \n\nAfterwards, quit and reopen the app.`);
      }
      
      //start updates if onCall and location tracking is enabled, stop updates if not
      if(backgroundLocationStatus?.granted && foregroundLocationStatus?.granted && !tracking && dsprDriver.onCall === true) {
        startLocationUpdates();
        Location.getCurrentPositionAsync().then(locationResponse => {
          handleLocationUpdate({ locations: [locationResponse]}, undefined)
        })
      }
      tracking && dsprDriver.onCall === false
    }
    if (tracking && !dsprDriver) stopLocationUpdates();
  };

  let oncallState = dsprDriver && dsprDriver.onCall;

  useEffect(() => {
    toggleLocationUpdates();
  }, [oncallState, isDemo]);

  useEffect(() => {
    if(lastLocationUpdateTime && !timeSinceLastUpdateInterval) setTimeSinceLastUpdateInterval(setInterval(() => msToTime(), 5000))
    return () => {
      if(timeSinceLastUpdateInterval) clearInterval(timeSinceLastUpdateInterval);
    }
  }, [])

  useEffect(()=> {
    if(lastLocationUpdateTime && !timeSinceLastUpdateInterval){
      setTimeSinceLastUpdateInterval(setInterval(() => msToTime(), 5000))
    }

    return function cleanup () {
      if(timeSinceLastUpdateInterval){
        clearInterval(timeSinceLastUpdateInterval);
      }
    }
  }, [lastLocationUpdateTime])

  const setOnCallStateHandler = (driverId, isOncall) => {
    setDriverOnCallState(driverId, isOncall) 
    if(backgroundLocationStatus?.granted && foregroundLocationStatus?.granted) {
      Location.getCurrentPositionAsync().then(locationResponse => {
        handleLocationUpdate({ locations: [locationResponse]}, undefined)
      })
    }
  }

  const handleOrdersCardClick = () => {
    RootNavigation.navigate('Main', {
      screen: 'OrdersNav',
    });
  } 

  const handleRoutesClick = () => {
    RootNavigation.navigate('Main', {
      screen: 'RoutingNav'
    })
  }

  const handleToggleShowSessionLocations = () => {
    setShowSessionLocations(!showSessionLocations);
  }

  return (
    <DashboardDisplay
      dspr={dspr}
      dsprDriver={dsprDriver}
      isLoading={isLoading}
      isDemo={isDemo}
      getDriverData={getDriverData}
      setDriverOnCallState={setOnCallStateHandler}
      showLocationPermissionAlert={showLocationPermissionAlert}
      closeLocationPermissionAlert={closeLocationPermissionAlert}
      locationPermissionAlertTitle={locationPermissionAlertTitle}
      locationPermissionAlertText={locationPermissionAlertText}
      foregroundLocationPermission={foregroundLocationStatus ? foregroundLocationStatus.granted ? "Granted" : "Not Granted" : undefined}
      backgroundLocationPermission={backgroundLocationStatus ? backgroundLocationStatus.granted ? "Granted" : "Not Granted" : undefined}
      sessionLocations={sessionLocations}
      showSessionLocations={showSessionLocations}
      setShowSessionLocations={handleToggleShowSessionLocations}
      lastLocationUpdateTime={timeSinceLastUpdateString}
      handleOrdersClick={handleOrdersCardClick}
      handleRoutesClick={handleRoutesClick}
    />

  );
};

// get permission for push notifications and set token
const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
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
    await Notifications.setNotificationChannelAsync('default', {
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
  handleLocationUpdate(data, error)
});

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
    dsprDriverId: driverId,
  });
  const dspr = dsprDriver ? getDSPRFromProps(state, { dsprId: dsprDriver.dspr }) : undefined;
  const isLoading = state.api.isLoading;
  const pushToken = state.api.entities.pushToken;
  const locations = getSessionLocations(state);
  const lastLocationUpdateTime = getLastUpdateTime(state);
  const isDemo = state.api.isDemo
  return {
    driverId,
    dspr,
    dsprDriver,
    isLoading,
    isDemo,
    pushToken,
    sessionLocations: locations,
    lastLocationUpdateTime
  };
};

const mapDispatchToProps = {
  refreshDSPRDriver,
  getDSPRDriver,
  sendPushToken,
  setDriverOnCallState,
  getLastUpdateTime
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);