import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Colors from '../constants/Colors';

const OrderButtons = () => {
  return (
    <View style={styles.buttonContainer}>
      <Button title="Cancel Order" onPress={() => console.log('cancel')} />
      <Button title="Complete Order" onPress={() => console.log('Complete')} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
  },
});

export default OrderButtons;
