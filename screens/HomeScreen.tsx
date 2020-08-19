import React from 'react';
import DrawerNavigator from '../navigation/DrawerNavigator';

const HomeScreen = ({ route, navigation }) => {
  const { dsprDrivers } = route.params;

  return <DrawerNavigator dsprDrivers={dsprDrivers} navigation={navigation} />;
};

export default HomeScreen;
