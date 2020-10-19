import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

const TopNavBar = ({ navigation, title, rightComponent }) => {
  const { colors } = useTheme();
  return (
    <Appbar.Header
      style={{
        elevation: 2,
        backgroundColor: colors.surface,
      }}
    >
      <Appbar.Action icon='menu' onPress={() => navigation.toggleDrawer()} />
      <View style={{ flex: 1 }}>
        <Text style={{ paddingLeft: 10, fontSize: 20, color: colors.accent, fontWeight: 'bold' }}>
          {title}
        </Text>
      </View>
      {rightComponent}
    </Appbar.Header>
  );
};

export default TopNavBar;
