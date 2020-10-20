import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { View } from 'react-native';

const RouteViewButtons = ({ routeView, setRouteView }) => {
  const { colors } = useTheme();

  const activeStyle = {
    borderRadius: 0,
    flex: 1,
    backgroundColor: colors.accent,
  };

  const inactiveStyle = {
    borderRadius: 0,
    flex: 1,
    backgroundColor: colors.primary,
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Button
        icon='map'
        mode='contained'
        style={routeView === 'map' ? activeStyle : inactiveStyle}
        labelStyle={{ paddingVertical: 4, color: colors.background }}
        onPress={() => setRouteView('map')}
      >
        Map View
      </Button>
      <Button
        icon='format-list-bulleted'
        mode='contained'
        style={routeView === 'list' ? activeStyle : inactiveStyle}
        labelStyle={{ paddingVertical: 4, color: colors.background }}
        onPress={() => setRouteView('list')}
      >
        List View
      </Button>
    </View>
  );
};

export default RouteViewButtons;
