import React from 'react';
import { CompositeNavigationProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from './DrawerNavigator';
import { IconButton } from 'react-native-paper';

import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageNotesScreen from '../screens/ManageNotesScreen';
import OrderListScreen from '../screens/OrderListScreen';
import OrderToScanScreen from "../screens/OrderToScanScreen";
import MetrcTagScannerScreen from "../screens/MetrcTagScannerScreen";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MetrcTagManualEntryScreen from "../screens/MetrcTagManualEntryScreen";

type OrderListNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerStackParamsList, 'OrdersNav'>,
    StackNavigationProp<OrderListStackParamsList>
    >;

type Props = {
    navigation: OrderListNavigationProp;
    route;
};

export type OrderListStackParamsList = {
    Orders: undefined;
    Details: { orderId: number };
    Notes: undefined;
    OrderToScan: { orderId: number };
    MetrcTagScanner: {  productName: string, productId: number, orderDetailId: number };
    MetrcTagManualEntry: {  productName: string, productId: number, orderDetailId: number };
};

const OrderListStack = createStackNavigator<OrderListStackParamsList>();

const OrderListNavigator = ({route, navigation}: Props) => {
    return (
        <OrderListStack.Navigator
            initialRouteName='Orders'
            screenOptions={{
                headerStyle: {height: 80},
                headerTitleStyle: {fontSize: 20},
                headerLeftContainerStyle: {paddingLeft: 20},
                gestureEnabled: false,
            }}
        >
            <OrderListStack.Screen
                name='Orders'
                component={OrderListScreen}
                options={{
                    headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
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
            <OrderListStack.Screen
                name={'OrderToScan'}
                component={OrderToScanScreen}
                options={{title: 'Package Order'}}
                initialParams={{ orderId: 42 }}
            />
            <OrderListStack.Screen
                name={'MetrcTagScanner'}
                component={MetrcTagScannerScreen}
                //options={({ route }) => ({title: route.params.productName})}
                options={{headerShown: false}}
            />
            <OrderListStack.Screen
                name={'MetrcTagManualEntry'}
                component={MetrcTagManualEntryScreen}
                options={{ presentation: 'modal', headerShown: false}}
            />
        </OrderListStack.Navigator>
    );
};

export default OrderListNavigator;
