import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/Colors';
import { getEnvVars } from '../environment';
const { apiUrl } = getEnvVars();

type CardProps = {
    dspr: any;
    handleSelect: (dsprId: number) => void;
}

const DsprCard = ({dspr, handleSelect}: CardProps) => {
  
  const image = dspr.imageLocation ? {uri: `https://api.grassp.it/${dspr.imageLocation}`} : require('../assets/grassp_health.png');
  // const image = dspr.imageLocation ? `${apiUrl}${dspr.imageLocation}` : '';

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleSelect(dspr.id)}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image}/>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{dspr.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContainer: {
    display: 'flex',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.light,
    maxWidth: 500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  image: {
    height: 80,
    width: 300
  },
  titleContainer: {
    flex: 1,
    backgroundColor: Colors.dark,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#fff'
  },
});

export default DsprCard;