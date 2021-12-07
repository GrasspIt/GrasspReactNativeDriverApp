import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
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
  locationPermissionAlertText
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
          <Text style={styles.dsprTitle}>{dspr.name}</Text>
          {dsprDriver && (
            <OnCallSwitch
              isLoading={isLoading}
              setDriverOnCallState={setDriverOnCallState}
              dsprDriver={dsprDriver}
            />
          )}
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
});

export default DashboardDisplay;
