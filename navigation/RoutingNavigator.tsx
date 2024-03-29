import React from 'react';
import { CompositeNavigationProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from './DrawerNavigator';
import { IconButton } from 'react-native-paper';

import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageNotesScreen from '../screens/ManageNotesScreen';
import RoutingScreen from '../screens/RoutingScreen';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import OrderListNavigator from "./OrderListNavigator";
import OrderToScanScreen from "../screens/OrderToScanScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import BarcodeManualEntryScreen from "../screens/BarcodeManualEntryScreen";

type RoutingNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerStackParamsList, 'RoutingNav'>,
    StackNavigationProp<RoutingStackParamsList>
    >;

type Props = {
  navigation: RoutingNavigationProp;
  route;
};

export type RoutingStackParamsList = {
  Details: { orderId: number };
  Notes: undefined;
  Routing: undefined;
  OrderToScan: { orderId: number };
  BarcodeScanner: {  productName: string, productId: number, orderDetailId: number, dsprId: number };
  BarcodeManualEntry: {  productName: string, productId: number, orderDetailId: number, dsprId: number };
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
        <RoutingStack.Screen
            name={'OrderToScan'}
            component={OrderToScanScreen}
            options={{title: 'Package Order'}}
            initialParams={{ orderId: 42 }}
        />
        <RoutingStack.Screen
            name={'BarcodeScanner'}
            component={BarcodeScannerScreen}
            //options={({ route }) => ({title: route.params.productName})}
            options={{headerShown: false}}
        />
        <RoutingStack.Screen
            name={'BarcodeManualEntry'}
            component={BarcodeManualEntryScreen}
            options={{ presentation: 'modal', headerShown: false}}
        />
    </RoutingStack.Navigator>
  );
};

export default RoutingNavigator;
