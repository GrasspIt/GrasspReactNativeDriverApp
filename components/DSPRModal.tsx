import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../store/reduxStoreState';
import { View, StyleSheet, FlatList, Text, Modal } from 'react-native';
import Colors from '../constants/Colors';
import DsprCard from './DsprCard';

const DsprModal = ({ modalVisible, setModalVisible, getDriverInfo }) => {
  const dsprs = useSelector<State, Object>((state) => state.api.entities.DSPRs);
  const dsprDrivers = useSelector<State, Object>((state) => state.api.entities.dsprDrivers);

  const dsprDataList = Object.values(dsprs);
  let dsprDriverDataList;
  if (dsprDrivers) {
    dsprDriverDataList = Object.values(dsprDrivers);
  }

  const handleSelectDspr = (dsprId: number) => {
    // find the dsprDriver that matches the dsprId
    const selectedDriver = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
    getDriverInfo(selectedDriver.id);
    setModalVisible(false);
  };

  return (
    <Modal visible={modalVisible} presentationStyle="fullScreen" animationType="slide">
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a Dispensary</Text>
        </View>
        <FlatList
          data={dsprDataList}
          renderItem={(item) => <DsprCard handleSelect={handleSelectDspr} dspr={item.item} />}
          keyExtractor={(item: any) => item.id.toString()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
  },
});

export default DsprModal;
