import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getLoggedInUser } from "../selectors/userSelectors";
import { attemptLogin } from "../actions/oauthActions";
import { State, User } from "../store/reduxStoreState";

import Login from "../components/Login";

const LoginScreen: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector<State, User>(getLoggedInUser);
    const errorMessage = useSelector<State, string>(state => state.api.errorMessage);

    useEffect(() => {
        // if (loggedInUser) history.push('/');
    });

    const handleSubmit = (username: string, password: string) => {
        dispatch(attemptLogin(username, password, '/'));
    }

    return <Login errorMessage={errorMessage} handleSubmit={handleSubmit} />
}

export default LoginScreen;