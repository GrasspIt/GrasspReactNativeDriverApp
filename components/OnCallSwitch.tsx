import React, { useState, useEffect } from 'react';
import { Text, Switch, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setDriverOnCallState } from '../actions/driverActions';
import { DsprDriver } from '../store/reduxStoreState';
import Colors from '../constants/Colors';

type SwitchProps = { dsprDriver: DsprDriver };

const OnCallSwitch = ({ dsprDriver }: SwitchProps) => {
  const dispatch = useDispatch();

  const [isOnCall, setIsOnCall] = useState<boolean | undefined>(false);

  const toggleSwitch = () => {
    if (dsprDriver) {
      let onCallString = !dsprDriver.onCall ? 'on' : null;
      dispatch(setDriverOnCallState(dsprDriver.id, onCallString));
      setIsOnCall(!isOnCall);
    }
  };

  useEffect(() => {
    if (dsprDriver) setIsOnCall(dsprDriver.onCall);
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
