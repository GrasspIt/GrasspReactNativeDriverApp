import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { connect } from 'react-redux';
import { preloadAccessTokenFromLocalStorage, logout } from '../actions/oauthActions';
import { setDsprDriverId } from '../actions/driverActions';
import { getLoggedInUser } from '../selectors/userSelectors';
import { StatusBar } from 'expo-status-bar';

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
  const { colors } = useTheme();
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size='large' color={colors.primary} />
      <StatusBar style='dark' />
    </View>
  );
};

const mapStateToProps = (state) => {
  const driverId = state.api.dsprDriverId;
  return {
    loggedInUser: getLoggedInUser(state),
    driverId,
  };
};

const mapDispatchToProps = { preloadAccessTokenFromLocalStorage, logout, setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
