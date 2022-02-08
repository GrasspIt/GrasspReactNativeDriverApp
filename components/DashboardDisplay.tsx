import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, useTheme, Card, Title, List } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import OnCallSwitch from './OnCallSwitch';
import AlertSuccessOrError from "./AlertSuccessOrError";

//tests
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"

type Props = {
  dspr;
  dsprDriver;
  isLoading: boolean;
  getDriverData;
  setDriverOnCallState;
  showLocationPermissionAlert: boolean;
  closeLocationPermissionAlert: () => any;
  locationPermissionAlertTitle: string;
  locationPermissionAlertText: string;
  foregroundLocationPermission: string | undefined;
  backgroundLocationPermission: string | undefined;
  sessionLocations: any[];
  lastLocationUpdateTime;
  showSessionLocations;
  setShowSessionLocations: () => void;
  handleOrdersClick: () => any;
};

const DashboardDisplay = ({
  dspr,
  dsprDriver,
  isLoading,
  getDriverData,
  setDriverOnCallState,
  showLocationPermissionAlert,
  closeLocationPermissionAlert,
  locationPermissionAlertTitle,
  locationPermissionAlertText,
  foregroundLocationPermission,
  backgroundLocationPermission,
  sessionLocations,
  showSessionLocations,
  setShowSessionLocations,
  lastLocationUpdateTime,
  handleOrdersClick
}: Props) => {
  const { colors } = useTheme();


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : dsprDriver ? (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={styles.cardContainer}>
            <Card style={[styles.card, styles.firstCard]}>
              <View style={styles.spacedRowFlex}>
                <Text style={styles.dsprTitle}>{dspr.name}</Text>
                <OnCallSwitch
                    isLoading={isLoading}
                    setDriverOnCallState={setDriverOnCallState}
                    dsprDriver={dsprDriver}
                  />
              </View>
            </Card>
          </View>
          
          {dsprDriver.queuedOrders && <View style={{display: 'flex', flexDirection:'row'}}>
            <View style={styles.ordersCardContainer}>
              {dsprDriver?.queuedOrders?.length && dsprDriver.queuedOrders.length > 0 ? 
              <Card style={[styles.ordersCard]} onPress={() => handleOrdersClick()}>
                <Text style={styles.dsprTitle}>Orders</Text>
                <Text style={styles.dsprTitle}>{Object.values(dsprDriver.queuedOrders).length}</Text>
              </Card>:  
              <Card style={styles.disabledCard}>
                <Text style={styles.dsprTitle}>No Orders</Text>
              </Card>}
              
            </View>
            <View style={ styles.ordersCardContainer}>
              {dsprDriver.currentRoute ? 
                <Card style={styles.ordersCard}>
                  <Text style={styles.dsprTitle}>Route</Text>
                  <Text style={styles.dsprTitle}>{dsprDriver.currentRoute ? JSON.stringify(dsprDriver.currentRoute): "No Route"}</Text>
                </Card> : 
                <Card style={styles.disabledCard}>
                  <Text style={styles.dsprTitle}>No Route</Text>
                </Card>
              }
            </View>
          </View>}
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Title style={styles.cardTitle}>Location Permissions</Title>
              <View style={styles.spacedRowFlex}>
                <Text style={styles.cardContent}>Foreground Permissions:</Text>
                <Text style={styles.cardContent}>{foregroundLocationPermission || "Unknown"}</Text>
              </View>
              <View style={styles.spacedRowFlex}>
                <Text style={styles.cardContent}>Background Permissions:</Text>
                <Text style={styles.cardContent}>{backgroundLocationPermission || "Unknown"}</Text>
              </View>  
            </Card>
          </View>
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <View style={styles.locationCardContent}>
                <Title>Session Locations</Title>
                {sessionLocations && sessionLocations.length !== 0 ? 
                <View style={styles.timeSinceLocation}>
                  <Text>Time Since Last Location Update: </Text>
                  <Text>{lastLocationUpdateTime}</Text>
                </View> : 
                null}
                {showSessionLocations ? sessionLocations && sessionLocations.length !== 0 ? 
                sessionLocations.map((location,index) => {
                    return location.error ? <List.Item key={index} title={"Error"} description={location.error.message} /> : <List.Item key={location.time.valueOf()} title={location.time.toLocaleString()} description={"Lat: " + location.lat + ", Long: " +  location.long} />
                  }) 
                  : <Text>No Location Data Available</Text> : null}
                <Button mode="text" onPress={()=>setShowSessionLocations()}>{showSessionLocations ? "Hide Locations" : "Show Locations"}</Button>
              </View>            
            </Card>
          </View>
        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text>Unable to fetch driver data.</Text>
          <Button disabled={isLoading} mode='text' onPress={getDriverData}>
            Try Again
          </Button>
        </View>
      )}
      <StatusBar style='dark' />

      {/*Modal used to prompt users to change location permissions*/}
      <AlertSuccessOrError
          isVisible={showLocationPermissionAlert}
          onDismiss={closeLocationPermissionAlert}
          title={locationPermissionAlertTitle}
          message={locationPermissionAlertText}
          buttonText={'Ok'}
          buttonOnPressSubmit={closeLocationPermissionAlert}
          customAnimationName={'locationPermission'}
          animationViewStyles={{marginTop: 16}}
          titleStyles={{marginTop: 12}}
          messageTextStyles={{marginTop: 16}}
      />
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
  card: {
    paddingBottom: 8,
  },
  cardContent: {
    fontSize: 16,
  },
  cardTitle: {
    marginHorizontal: 16
  },
  locationCardContent: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 16,
  },
  spacedRowFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  timeSinceLocation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  firstCard: {
    marginTop: 16
  },
  ordersCardContainer: {
    width: "50%",
    padding: 16
  },
  ordersCard: {
    width: "100%",
    paddingBottom: 16
  },
  disabledCard: {
    backgroundColor: "#d8d8d8",
    width: "100%",
    paddingBottom: 16
  },
  cardContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8
  }
});

export default DashboardDisplay;
