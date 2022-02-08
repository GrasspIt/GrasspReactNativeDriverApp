import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { DsprDriver } from '../store/reduxStoreState';
import { useTheme, Switch } from 'react-native-paper';

type SwitchProps = { dsprDriver: DsprDriver; setDriverOnCallState; isLoading };

const OnCallSwitch = ({ dsprDriver, setDriverOnCallState, isLoading }: SwitchProps) => {
  const { colors } = useTheme();
  const [isOnCall, setIsOnCall] = useState<boolean | undefined>(false);

  const toggleSwitch = () => {
    if (!dsprDriver.currentInventoryPeriod) {
      Alert.alert('You must have a current inventory period to go on call.');
      return;
    }
    if (dsprDriver && dsprDriver.onCall !== null) {
      let onCallString = !dsprDriver.onCall ? 'on' : null;
      setDriverOnCallState(dsprDriver.id, onCallString);
      setIsOnCall(!isOnCall);
    }
  };

  useEffect(() => {
    if (dsprDriver && dsprDriver.onCall !== null) setIsOnCall(dsprDriver.onCall);
  }, [dsprDriver]);

  return (
    <View style={{ display: 'flex', flexDirection:'row', alignItems: 'center', paddingTop: 12 }}>
      <Text style={{paddingRight: 8}}>{isOnCall ? 'On Call' : 'Not on Call'}</Text>
      <Switch
        disabled={isLoading ? true : false}
        color={colors.primary}
        onValueChange={toggleSwitch}
        value={isOnCall}
      />
    </View>
  );
};

export default OnCallSwitch;
