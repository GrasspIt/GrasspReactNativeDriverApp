import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { connect } from 'react-redux';
import { preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';
import { setDsprDriverId } from '../actions/driverActions';
import { getLoggedInUser } from '../selectors/userSelectors';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Startup'>;
type Props = {
  navigation: LoginScreenNavigationProp;
  loggedInUser;
  driverId;
  preloadAccessTokenFromLocalStorage;
  logout;
  setDsprDriverId;
};

const Startup = ({
  navigation,
  loggedInUser,
  driverId,
  preloadAccessTokenFromLocalStorage,
  logout,
  setDsprDriverId,
}: Props) => {
  // if a valid token is stored, login automatically
  useEffect(() => {
    preloadAccessTokenFromLocalStorage();
  }, []);

  const handleNavigate = () => {
    if (loggedInUser && loggedInUser.dsprDrivers && loggedInUser.dsprDrivers.length === 1) {
      setDsprDriverId(loggedInUser.dsprDrivers[0]);
    }
    if (loggedInUser && loggedInUser.dsprDrivers && loggedInUser.dsprDrivers.length > 1) {
      navigation.navigate('Main', { screen: 'DSPRs' });
    }
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.dsprDrivers && !driverId) {
      if (loggedInUser.dsprDrivers.length > 0) {
        handleNavigate();
      } else {
        logout();
        navigation.navigate('Login');
      }
    }
  }, [loggedInUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
  };
};

const mapDispatchToProps = { preloadAccessTokenFromLocalStorage, logout, setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
