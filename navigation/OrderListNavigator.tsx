import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import { IconButton } from 'react-native-paper';

import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageNotesScreen from '../screens/ManageNotesScreen';
import OrderListScreen from '../screens/OrderListScreen';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type OrderListNavigationProp = DrawerNavigationProp<DrawerStackParamsList, 'Orders'>;
type Props = {
  navigation: OrderListNavigationProp;
  route;
};

export type OrderListStackParamsList = {
  Orders: any;
  Details: { orderId: number };
  Notes: any;
};

const OrderListStack = createStackNavigator<OrderListStackParamsList>();

const OrderListNavigator = ({ route, navigation }: Props) => {
  return (
    <OrderListStack.Navigator
      initialRouteName='Orders'
      screenOptions={{
        headerStyle: { height: 80 },
        headerTitleStyle: { fontSize: 20 },
        headerLeftContainerStyle: { paddingLeft: 20 },
        gestureEnabled: false,
      }}
    >
      <OrderListStack.Screen
        name='Orders'
        component={OrderListScreen}
        options={{
          headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()} />,
        }}
      />
      <OrderListStack.Screen
        name='Details'
        component={OrderDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
      <OrderListStack.Screen
        name='Notes'
        component={ManageNotesScreen}
        options={{
          headerShown: true,
        }}
      />
    </OrderListStack.Navigator>
  );
};

export default OrderListNavigator;
