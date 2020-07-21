import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getLoggedInUser } from "../selectors/userSelectors";
import { attemptLogin } from "../actions/oauthActions";
import { State, User } from "../store/reduxStoreState";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

import Login from "../components/Login";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector<State, User>(getLoggedInUser);
    // const errorMessage = useSelector<State, string>(state => state.api.errorMessage);

    useEffect(() => {
        if (loggedInUser) navigation.navigate('Dashboard');
    });

    const handleSubmit = (username: string, password: string) => {
        dispatch(attemptLogin(username, password));
    }

    // return <Login errorMessage={errorMessage} handleSubmit={handleSubmit} />
    return <Login />
}

export default LoginScreen;