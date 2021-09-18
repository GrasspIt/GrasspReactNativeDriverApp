import React from 'react';
import { CompositeNavigationProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from './DrawerNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import { IconButton } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { OrderListStackParamsList } from "./OrderListNavigator";

type DashboardNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerStackParamsList, 'DashboardNav'>,
    StackNavigationProp<OrderListStackParamsList>
    >;

type Props = {
  navigation: DashboardNavigationProp;
  route;
};

export type DashboardStackParamsList = {
  Dashboard: undefined;
};

const DashboardStack = createStackNavigator<DashboardStackParamsList>();

const DashboardNavigator = ({ route, navigation }: Props) => {
  return (
    <DashboardStack.Navigator
      initialRouteName='Dashboard'
      screenOptions={{
        headerStyle: { height: 80 },
        headerTitleStyle: { fontSize: 20 },
        headerLeftContainerStyle: { paddingLeft: 20 },
        gestureEnabled: false,
      }}
    >
      <DashboardStack.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{
          headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()} />,
        }}
      />
    </DashboardStack.Navigator>
  );
};

export default DashboardNavigator;
