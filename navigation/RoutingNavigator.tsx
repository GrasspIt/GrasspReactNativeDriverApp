import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import { IconButton } from 'react-native-paper';

import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageNotesScreen from '../screens/ManageNotesScreen';
import RoutingScreen from '../screens/RoutingScreen';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type RoutingNavigationProp = DrawerNavigationProp<DrawerStackParamsList, 'Routing'>;
type Props = {
  navigation: RoutingNavigationProp;
  route;
};

export type RoutingStackParamsList = {
  Details: { orderId: number };
  Notes: any;
  Routing: any;
};

const RoutingStack = createStackNavigator<RoutingStackParamsList>();

const RoutingNavigator = ({ route, navigation }: Props) => {
  return (
    <RoutingStack.Navigator
      initialRouteName='Routing'
      screenOptions={{
        headerStyle: { height: 80 },
        headerTitleStyle: { fontSize: 20 },
        headerLeftContainerStyle: { paddingLeft: 20 },
        gestureEnabled: false,
      }}
    >
      <RoutingStack.Screen
        name='Routing'
        component={RoutingScreen}
        options={{
          headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()} />,
        }}
      />
      <RoutingStack.Screen
        name='Details'
        component={OrderDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
      <RoutingStack.Screen
        name='Notes'
        component={ManageNotesScreen}
        options={{
          headerShown: true,
        }}
      />
    </RoutingStack.Navigator>
  );
};

export default RoutingNavigator;
