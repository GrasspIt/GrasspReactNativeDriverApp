import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';

import HomeScreen from '../screens/HomeScreen';

type DashboardNavigationProp = StackNavigationProp<DrawerStackParamsList, 'Dashboard'>;
type Props = {
  navigation: DashboardNavigationProp;
  route;
};

export type DashboardStackParamsList = {
  Home: any;
};

const DashboardStack = createStackNavigator<DashboardStackParamsList>();

const DashboardNavigator = ({ route, navigation }: Props) => {
  return (
    <DashboardStack.Navigator initialRouteName='Home' screenOptions={{ gestureEnabled: false }}>
      <DashboardStack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerTitle: 'Dashboard',
          headerShown: false,
        }}
      />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
