import React, { useState, useEffect } from 'react';
import { Text, Switch, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setDriverOnCallState } from '../actions/driverActions';
import { DsprDriver } from '../store/reduxStoreState';
import Colors from '../constants/Colors';

type SwitchProps = { dsprDriver: DsprDriver };

const OnCallSwitch = ({ dsprDriver }: SwitchProps) => {
  const dispatch = useDispatch();

  const [isOnCall, setIsOnCall] = useState<boolean | undefined>(false);

  const toggleSwitch = () => {
    if (!dsprDriver.currentInventoryPeriod) {
      Alert.alert('You must have a current inventory period to go on call.');
      return;
    }
    if (dsprDriver && dsprDriver.onCall !== null) {
      let onCallString = !dsprDriver.onCall ? 'on' : null;
      dispatch(setDriverOnCallState(dsprDriver.id, onCallString));
      setIsOnCall(!isOnCall);
    }
  };

  useEffect(() => {
    if (dsprDriver && dsprDriver.onCall !== null) setIsOnCall(dsprDriver.onCall);
  }, [dsprDriver]);

  return (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Switch
        trackColor={{ false: Colors.medium, true: Colors.green }}
        thumbColor={isOnCall ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isOnCall}
      />
      <Text>{isOnCall ? 'On Call' : 'Not on Call'}</Text>
    </View>
  );
};

export default OnCallSwitch;
