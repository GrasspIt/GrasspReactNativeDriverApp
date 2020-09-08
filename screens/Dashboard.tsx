import React from 'react';
import DashboardNavigator from '../navigation/DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';

type DashboardNavigationProp = StackNavigationProp<RootStackParamsList, 'Main'>;

type Props = {
  navigation: DashboardNavigationProp;
  route;
};

const Dashboard = ({ route, navigation }: Props) => {
  const { driverId } = route.params;

  return <DashboardNavigator driverId={driverId} />;
};

export default Dashboard;
