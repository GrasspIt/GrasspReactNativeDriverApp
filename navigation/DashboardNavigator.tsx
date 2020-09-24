import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import OrderDetails from '../screens/OrderDetails';
import { Order } from '../store/reduxStoreState';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import ManageNotes from '../screens/ManageNotesScreen';

type DashboardNavigationProp = StackNavigationProp<DrawerStackParamsList, 'Dashboard'>;
type Props = {
  navigation: DashboardNavigationProp;
  route;
};

export type DashboardStackParamsList = {
  Home: { driverId: number };
  Details: { orderId: number };
  Notes: any;
};

const DashboardStack = createStackNavigator<DashboardStackParamsList>();

const DashboardNavigator = ({ route, navigation }: Props) => {
  return (
    <DashboardStack.Navigator initialRouteName="Home" screenOptions={{ gestureEnabled: false }}>
      <DashboardStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <DashboardStack.Screen
        name="Details"
        component={OrderDetails}
        options={{
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name="Notes"
        component={ManageNotes}
        options={{
          headerShown: true,
        }}
      />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
