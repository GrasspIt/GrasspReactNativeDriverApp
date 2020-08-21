import React from 'react';
import DrawerNavigator from '../navigation/DrawerNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/ScreenNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route;
};

const HomeScreen = ({ route, navigation }: Props) => {
  const { dsprDrivers } = route.params;

  return <DrawerNavigator dsprDrivers={dsprDrivers} navigation={navigation} />;
};

export default HomeScreen;
