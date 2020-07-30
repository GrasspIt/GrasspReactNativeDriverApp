import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { getDSPRDriver, setDriverOnCallState, setDsprDriverId } from "../actions/driverActions";
import Colors from '../constants/Colors';

type SwitchProps = {
    dsprDriverInfo: {id: number, onCall: boolean};
}

const OnCallSwitch = ({dsprDriverInfo}: SwitchProps) => {
    
    const [ isOnCall, setIsOnCall ] = useState(dsprDriverInfo.onCall);
  
    const dispatch = useDispatch();
  
    const setOnCallState = () => {
      let onCallString = isOnCall ? 'on' : null;
      dispatch(setDriverOnCallState(dsprDriverInfo.id, onCallString));
    }
    
    const toggleSwitch = () => {
      setIsOnCall(!isOnCall);
      setOnCallState();
    }

    return (
        <>
            <Switch
                trackColor={{ false: Colors.red, true: Colors.green }}
                thumbColor={dsprDriverInfo.onCall ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={dsprDriverInfo.onCall}
            />
            <Text>{dsprDriverInfo.onCall ? 'On Call' : 'Not on Call'}</Text>
        </>
    )
};

export default OnCallSwitch;