import React from 'react';
import DrawerNavigator from '../navigation/DrawerNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
  route;
};

const MainScreen = ({ route, navigation }: Props) => {
  const { dsprDrivers } = route.params;

  return <DrawerNavigator dsprDrivers={dsprDrivers} navigation={navigation} />;
};

export default MainScreen;
