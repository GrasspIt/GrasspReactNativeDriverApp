import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import DsprCard from '../components/DsprCard';

type Props = { handleSelectDspr; dsprDataList };

const DSPRList = ({ handleSelectDspr, dsprDataList }: Props) => {
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
    flex: 1,
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

export default DSPRList;
