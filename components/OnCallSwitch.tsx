import React, { useState, useEffect } from 'react';
import { Text, Switch, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setDriverOnCallState } from '../actions/driverActions';
import { DsprDriver } from '../store/reduxStoreState';
import { useTheme } from 'react-native-paper';

type SwitchProps = { dsprDriver: DsprDriver };

const OnCallSwitch = ({ dsprDriver }: SwitchProps) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
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
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <Switch
        trackColor={{ false: colors.backdrop, true: colors.primary }}
        thumbColor={isOnCall ? colors.surface : colors.surface}
        ios_backgroundColor={colors.backdrop}
        onValueChange={toggleSwitch}
        value={isOnCall}
      />
      <Text>{isOnCall ? 'On Call' : 'Not on Call'}</Text>
    </View>
  );
};

export default OnCallSwitch;
