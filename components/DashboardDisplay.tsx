import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import OnCallSwitch from './OnCallSwitch';

type Props = {
  dspr;
  dsprDriver;
  isLoading;
  getDriverData;
  setDriverOnCallState;
};

const DashboardDisplay = ({
  dspr,
  dsprDriver,
  isLoading,
  getDriverData,
  setDriverOnCallState,
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
            <OnCallSwitch setDriverOnCallState={setDriverOnCallState} dsprDriver={dsprDriver} />
          )}
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

export default DashboardDisplay;
