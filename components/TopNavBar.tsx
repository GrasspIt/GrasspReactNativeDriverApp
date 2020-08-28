import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';
import { logout } from '../actions/oauthActions';
import { useDispatch } from 'react-redux';
import * as RootNavigation from '../navigation/RootNavigation';

const TopNavBar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    RootNavigation.navigate('Login', null);
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content
        title={<Image source={require('../assets/grassp_health.png')} style={styles.image} />}
      />
      <Appbar.Action icon="dots-vertical" onPress={handleLogout} />
    </Appbar.Header>
    // <Header
    //   leftComponent={{
    //     icon: 'menu',
    //     color: Colors.black,
    //     onPress: () => navigation.toggleDrawer(),
    //   }}
    //   centerComponent={
    //     <Image
    //       source={require('../assets/grassp_health.png')}
    //       style={{ marginLeft: 20, height: 40, width: 200 }}
    //     />
    //   }
    //   rightComponent={{
    //     icon: 'menu',
    //     color: Colors.black,
    //     onPress: () => handleLogout(),
    //   }}
    //   containerStyle={{
    //     backgroundColor: Colors.light,
    //     borderBottomWidth: 2,
    //     borderBottomColor: Colors.medium,
    //   }}
    // />
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
