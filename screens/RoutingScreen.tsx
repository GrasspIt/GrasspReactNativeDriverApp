import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import MapView from 'react-native-maps';

type RoutingScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Routing'>;
type Props = {
  navigation: RoutingScreenNavigationProp;
};

const RoutingScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default RoutingScreen;
