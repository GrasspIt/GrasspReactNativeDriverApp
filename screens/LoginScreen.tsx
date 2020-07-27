import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getLoggedInUser } from "../selectors/userSelectors";
import { attemptLogin } from "../actions/oauthActions";
import { State, User } from "../store/reduxStoreState";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

import Login from "../components/Login";
import { Alert } from "react-native";
import { getDSPRDriver } from "../actions/driverActions";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {

    const [ isLoading, setIsLoading ] = useState(false);

    const dispatch = useDispatch();
    const loggedInUser = useSelector<State, User>(getLoggedInUser);
    const errorMessage = useSelector<State, string>(state => state.api.errorMessage);
    console.log(loggedInUser);

    useEffect(() => {
        if (!loggedInUser && errorMessage) {
            setIsLoading(false);
            Alert.alert(errorMessage);
        };
        if (loggedInUser) {
            setIsLoading(false);
            if (loggedInUser.dsprDrivers.length === 1) {
                navigation.navigate('DSPRs', { driverIds: loggedInUser.dsprDrivers })
            } else {
                // dispatch(getDSPRDriver(loggedInUser.dsprDrivers[0]));
                navigation.navigate('Dashboard', { driverId: loggedInUser.dsprDrivers[0] });
            }
        }
    }, [loggedInUser, errorMessage]);

    const handleLogin = (username: string, password: string) => {
        dispatch(attemptLogin(username, password));
        setIsLoading(true);
    }

    return <Login handleLogin={handleLogin} isLoading={isLoading} />
}

export default LoginScreen;