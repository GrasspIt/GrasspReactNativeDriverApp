import React, { useState } from 'react';
import { Text, Switch } from 'react-native';
import { useDispatch } from "react-redux";
import { setDriverOnCallState } from "../actions/driverActions";
import {  DsprDriver } from "../store/reduxStoreState";
import Colors from '../constants/Colors';

type SwitchProps = {
    dsprDriver: DsprDriver;
}

const OnCallSwitch = ({dsprDriver}: SwitchProps) => {
    
    const [ isOnCall, setIsOnCall ] = useState(dsprDriver.onCall);
  
    const dispatch = useDispatch();
  
    const setOnCallState = () => {
      let onCallString = isOnCall ? 'on' : null;
      dispatch(setDriverOnCallState(dsprDriver.id, onCallString));
    }
    
    const toggleSwitch = () => {
      setIsOnCall(!isOnCall);
      setOnCallState();
    }

    return (
        <>
            <Switch
                trackColor={{ false: Colors.red, true: Colors.green }}
                thumbColor={dsprDriver.onCall ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={dsprDriver.onCall}
            />
            <Text>{dsprDriver.onCall ? 'On Call' : 'Not on Call'}</Text>
        </>
    )
};

export default OnCallSwitch;