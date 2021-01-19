import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { setDriverOnCallState } from '../actions/driverActions';
import { DsprDriver } from '../store/reduxStoreState';
import { useTheme, Switch } from 'react-native-paper';

type SwitchProps = { dsprDriver: DsprDriver; setDriverOnCallState };

const OnCallSwitch = ({ dsprDriver, setDriverOnCallState }: SwitchProps) => {
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
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <Switch color={colors.primary} onValueChange={toggleSwitch} value={isOnCall} />
      <Text>{isOnCall ? 'On Call' : 'Not on Call'}</Text>
    </View>
  );
};

const mapDispatchToProps = { setDriverOnCallState };

export default connect(null, mapDispatchToProps)(OnCallSwitch);
