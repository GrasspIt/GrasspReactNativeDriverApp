import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import { IconButton } from 'react-native-paper';

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
