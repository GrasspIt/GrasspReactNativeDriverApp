import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';

import DashboardScreen from '../screens/DashboardScreen';

type DashboardNavigationProp = StackNavigationProp<DrawerStackParamsList, 'Dashboard'>;
type Props = {
  navigation: DashboardNavigationProp;
  route;
};

export type DashboardStackParamsList = {
  Dashboard: any;
};

const DashboardStack = createStackNavigator<DashboardStackParamsList>();

const DashboardNavigator = ({ route, navigation }: Props) => {
  return (
    <DashboardStack.Navigator
      initialRouteName='Dashboard'
      screenOptions={{ gestureEnabled: false }}
    >
      <DashboardStack.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
