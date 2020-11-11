import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { getEnvVars } from '../environment';
const { apiUrl } = getEnvVars();

type CardProps = {
  dspr: any;
  handleSelect: (dsprId: number) => void;
};

const DsprCard = ({ dspr, handleSelect }: CardProps) => {
  const { colors } = useTheme();
  const image = dspr.imageLocation
    ? { uri: `${apiUrl}${dspr.imageLocation}` }
    : require('../assets/grassp_health.png');

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleSelect(dspr.id)}>
      <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.imageContainer}>
          <Image resizeMode='contain' style={styles.image} source={image} />
        </View>
        <View style={[styles.titleContainer, { backgroundColor: colors.onSurface }]}>
          <Text style={styles.title}>{dspr.name}</Text>
        </View>
      </View>
      <StatusBar style='dark' />
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
