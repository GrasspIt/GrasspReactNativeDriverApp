import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { View } from 'react-native';

const RouteAndOrderViewButtons = ({ view, setView }) => {
  const { colors } = useTheme();

  const activeStyle = {
    borderRadius: 0,
    flex: 1,
    elevation: 4,
    backgroundColor: colors.accent,
  };

  const inactiveStyle = {
    borderRadius: 0,
    flex: 1,
    elevation: 4,
    backgroundColor: colors.primary,
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row' , zIndex: 1}}>
      <Button
        icon='map'
        mode='contained'
        style={view === 'map' ? activeStyle : inactiveStyle}
        labelStyle={{ paddingVertical: 4, color: colors.background }}
        onPress={() => setView('map')}
      >
        Map View
      </Button>
      <Button
        icon='format-list-bulleted'
        mode='contained'
        style={view === 'list' ? activeStyle : inactiveStyle}
        labelStyle={{ paddingVertical: 4, color: colors.background }}
        onPress={() => setView('list')}
      >
        List View
      </Button>
    </View>
  );
};

export default RouteAndOrderViewButtons;
