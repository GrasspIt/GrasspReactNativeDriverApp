import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';

const TopNavBar = ({ navigation, dsprName }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content title={dsprName} color={Colors.dark} titleStyle={{ fontSize: 22 }} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.medium,
  },
  image: {
    height: 40,
    width: 200,
  },
});

export default TopNavBar;
