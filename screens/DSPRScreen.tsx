import React from 'react';
import { connect } from 'react-redux';
import { setDsprDriverId } from '../actions/driverActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import DsprCard from '../components/DsprCard';
import { StatusBar } from 'expo-status-bar';

type DSPRScreenNavigationProp = StackNavigationProp<DrawerStackParamsList, 'DSPRs'>;
type Props = { navigation: DSPRScreenNavigationProp; setDsprDriverId; dsprs; dsprDrivers };

const DSPRScreen = ({ navigation, setDsprDriverId, dsprs, dsprDrivers }: Props) => {
  const { colors } = useTheme();

  const dsprDataList = Object.values(dsprs);
  const dsprDriverDataList = dsprDrivers && Object.values(dsprDrivers);

  const handleSelectDspr = (dsprId: number) => {
    // find the dsprDriver that matches the dsprId
    const selectedDriver: any = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
    setDsprDriverId(selectedDriver.id);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Dispensary</Text>
      </View>
      <FlatList
        data={dsprDataList}
        renderItem={(item) => <DsprCard handleSelect={handleSelectDspr} dspr={item.item} />}
        keyExtractor={(item: any) => item.id.toString()}
      />
      <StatusBar style='dark' />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 22,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  const dsprs = state.api.entities.DSPRs;
  const dsprDrivers = state.api.entities.dsprDrivers;
  return {
    isLoading,
    dsprs,
    dsprDrivers,
  };
};

const mapDispatchToProps = { setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(DSPRScreen);
