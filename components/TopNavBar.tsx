import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import Colors from '../constants/Colors';
// import { logout } from '../actions/oauthActions';
// import { useDispatch } from 'react-redux';

const TopNavBar = ({ navigation, setModalVisible, dsprDrivers, dsprName }) => {
  // const dispatch = useDispatch();

  // const [visible, setVisible] = React.useState(false);

  // const toggleMenu = () => setVisible(!visible);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   toggleMenu();
  //   navigation.navigate('Login', null);
  // };

  // const handleDsprs = () => {
  //   setModalVisible(true);
  //   toggleMenu();
  // };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content
        title={dsprName}
        color={Colors.dark}
        titleStyle={{ fontSize: 22 }}
        // title={<Image source={require('../assets/grassp_health.png')} style={styles.image} />}
      />
      {/* <Menu
        visible={visible}
        onDismiss={toggleMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={toggleMenu} />}
        style={{ top: 75 }}
      >
        {dsprDrivers.length > 1 ? <Menu.Item onPress={handleDsprs} title="DSPRs" /> : null}
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu> */}
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
