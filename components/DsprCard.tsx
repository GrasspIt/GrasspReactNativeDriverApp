import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { getEnvVars } from '../environment';
const { apiUrl } = getEnvVars();

type CardProps = {
  dspr: any;
  handleSelect: (dsprId: number) => void;
};

const DsprCard = ({ dspr, handleSelect }: CardProps) => {
  // const image = dspr.imageLocation
  //   ? { uri: `https://api.grassp.it/${dspr.imageLocation}` }
  //   : require('../assets/grassp_health.png');
  const image = dspr.imageLocation
    ? { uri: `${apiUrl}${dspr.imageLocation}` }
    : require('../assets/grassp_health.png');

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleSelect(dspr.id)}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image resizeMode="contain" style={styles.image} source={image} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{dspr.name}</Text>
        </View>
      </View>
      <StatusBar style="dark" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContainer: {
    display: 'flex',
    margin: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.light,
    maxWidth: 500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    minHeight: 200,
    padding: 10,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  titleContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    opacity: 0.9,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#fff',
  },
});

export default DsprCard;
