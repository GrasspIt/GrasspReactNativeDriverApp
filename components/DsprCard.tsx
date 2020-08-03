import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/Colors';
import { getEnvVars } from '../environment';
import { withTheme } from 'react-native-elements';
const { apiUrl } = getEnvVars();

type CardProps = {
    dspr: any;
    handleSelect: (dsprId: string) => void;
}

const DsprCard = ({dspr, handleSelect}: CardProps) => {
  
  const image = dspr.imageLocation ? `https://api.grassp.it/${dspr.imageLocation}` : '';
  // const image = dspr.imageLocation ? `${apiUrl}${dspr.imageLocation}` : '';

  console.log(image)
  return (
    <TouchableOpacity style={styles.container} onPress={() => handleSelect(dspr.id)}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: image }}/>
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
    elevation: 4,
  },
  cardContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.light,
  },
  imageContainer: {
    padding: 30
  },
  image: {
    height: 80
  },
  titleContainer: {
    flex: 1,
    backgroundColor: Colors.dark,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#fff'
  },
});

export default DsprCard;