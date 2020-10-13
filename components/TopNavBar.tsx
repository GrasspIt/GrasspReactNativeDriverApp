import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';

const TopNavBar = ({ navigation, title }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content
        color={Colors.dark}
        title={title}
        titleStyle={{ fontSize: 20, color: Colors.secondary, fontWeight: 'bold' }}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.medium,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default TopNavBar;
