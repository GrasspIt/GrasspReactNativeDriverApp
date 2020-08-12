import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { getEnvVars } from '../environment';
const { apiUrl } = getEnvVars();

type CardProps = {
    dspr: any;
    handleSelect: (dsprId: number) => void;
}

const DsprCard = ({dspr, handleSelect}: CardProps) => {
  
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();

  const image = dspr.imageLocation ? { uri: `https://api.grassp.it/${dspr.imageLocation}` } : require('../assets/grassp_health.png');
  // const image = dspr.imageLocation ? `${apiUrl}${dspr.imageLocation}` : '';

  useEffect(() => {
    Image.getSize(`https://api.grassp.it/${dspr.imageLocation}`, (width, height) => {
      // calculate image width and height 
      const screenWidth = Dimensions.get('window').width - 60;
      const scaleFactor = screenWidth / width;
      const imageHeight = height * scaleFactor;
      setImageWidth(screenWidth);
      setImageHeight(imageHeight);
    }, (error) => console.log(error))
  }, [image])

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleSelect(dspr.id)}>
      <View style={styles.cardContainer}>
        <View style={{ paddingVertical: 0 }}>
          <Image style={{ width: imageWidth, height: imageHeight, minHeight: 120 }} source={image}/>
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
  titleContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    opacity: 0.9
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#fff'
  },
});

export default DsprCard;