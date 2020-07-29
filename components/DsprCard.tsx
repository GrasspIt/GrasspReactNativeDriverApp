import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import Colors from '../constants/Colors';

type CardProps = {
    dspr: any;
    handleSelect: (dsprId: string) => void;
}

const DsprCard = ({dspr, handleSelect}: CardProps) => {

  return (
    <TouchableOpacity onPress={() => handleSelect(dspr.id)}>
      <Card
          // image={dspr.imageLocation}
      >
        <View>
          <Text style={styles.title}>{dspr.name}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 20
  },
});

export default DsprCard;