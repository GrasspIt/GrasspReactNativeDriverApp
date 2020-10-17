import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

const TopNavBar = ({ navigation, title }) => {
  const { colors } = useTheme();
  return (
    <Appbar.Header
      style={{
        elevation: 2,
        backgroundColor: colors.surface,
      }}
    >
      <Appbar.Action icon='menu' onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content
        title={title}
        titleStyle={{ fontSize: 20, color: colors.accent, fontWeight: 'bold' }}
      />
    </Appbar.Header>
  );
};

export default TopNavBar;
