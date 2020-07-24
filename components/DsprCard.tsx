import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import Colors from '../constants/Colors';

type CardProps = {
    dspr: any;
}

const DsprCard = ({dspr}: CardProps) => {

    console.log(dspr)
    //get DSPR based api.entities.DSPRs

  return (
    <Card
        // image={DSPR.imageLocation}
    >
      <View>
        {/* <Text style={styles.title}>Welcome</Text> */}
        <Text style={styles.title}>{dspr.name}</Text>
      </View>
    </Card>
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