import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';

const TopNavBar = ({ navigation, dsprName }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content
        // title={<Image style={styles.image} source={require('../assets/grassp_health.png')} />}
        color={Colors.dark}
        title="GrasspHealth"
        titleStyle={{ fontSize: 22 }}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 30,
    width: 150,
  },
});

export default TopNavBar;
