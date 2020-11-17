import base64 from 'Base64';
import qs from 'query-string';
import * as SecureStore from 'expo-secure-store';
import { CALL_API, Schemas } from '../middleware/api';

// import { logException } from './apiUIHelperActions';

import { getEnvVars } from '../environment';
import { Alert } from 'react-native';
const { apiUrl } = getEnvVars();

export const API_HOST = apiUrl;
const AUTH_API_ENDPOINT = `${API_HOST}oauth/token`;

export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_ACCESS_TOKEN_TYPE = 'accessTokenType';
export const ACCESS_TOKEN_TYPES = { user: 'USER', app: 'APP' };

export const GET_APP_ACCESS_TOKEN_SUCCESS = 'GET_APP_ACCESS_TOKEN_SUCCESS';
export const GET_APP_ACCESS_TOKEN_FAILURE = 'GET_APP_ACCESS_TOKEN_FAILURE';
export const PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE = 'PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE';

export const preloadAccessTokenFromLocalStorage = () => {
  return async (dispatch) => {
    const accessToken = await SecureStore.getItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    if (!accessToken) {
      return;
    }
    dispatch({
      type: PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE,
      accessToken,
    });
    dispatch(getLoggedInUser()).catch((error) => Alert.alert(error));
  };
};

export const setAccessToken = (type, accessToken, accessTokenType) => {
  try {
    SecureStore.setItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
    SecureStore.setItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_TYPE, accessTokenType);
  } catch (err) {
    console.log('Failed to set access token:', err);
    // logException(err, { type, accessToken, accessTokenType });
  }
  return {
    type,
    accessToken,
  };
};

export const getAccessTokenType = () => {
  return SecureStore.getItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_TYPE);
};

export const getAccessToken = () => {
  return SecureStore.getItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
};

export const LOGOUT = 'LOGOUT';

export const logout = () => {
  SecureStore.deleteItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  SecureStore.deleteItemAsync(LOCAL_STORAGE_ACCESS_TOKEN_TYPE);
  return { type: LOGOUT };
};

const apiError = (type, error, context) => {
  // logException(error, context);
  return { type, error };
};

const fetchAccessToken = (body) => {
  return fetch(AUTH_API_ENDPOINT, {
    mode: 'cors',
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.btoa('grassp:grassp')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
};

const callOnFetchAccessToken = (body, successType, failureType, accessTokenType) => {
  return (dispatch) => {
    return fetchAccessToken(body)
      .then((response) =>
        response.json().then(
          (json) => {
            if (!response.ok) {
              return dispatch(apiError(failureType, 'Fetch Access Token Fail', { body }));
            } else {
              return dispatch(setAccessToken(successType, json.access_token, accessTokenType));
            }
          },
          (error) => {
            return dispatch(apiError(failureType, error, { body }));
          }
        )
      )
      .catch((error) => {
        return dispatch(apiError(failureType, error, { body }));
      });
  };
};

export const getAppAccessToken = () => (dispatch, getState) => {
  dispatch(logout());
  if (getState().api.accessToken === '')
    return dispatch(
      callOnFetchAccessToken(
        'grant_type=client_credentials',
        GET_APP_ACCESS_TOKEN_SUCCESS,
        GET_APP_ACCESS_TOKEN_FAILURE,
        ACCESS_TOKEN_TYPES.app
      )
    );
  return {};
};
export const LOGGED_IN_USER_INFO = 'LOGGED_IN_USER_INFO';
export const LOGGED_IN_USER_INFO_SUCCESS = 'LOGGED_IN_USER_INFO_SUCCESS';
export const LOGGED_IN_USER_INFO_FAILURE = 'LOGGED_IN_USER_INFO_FAILURE';

const getLoggedInUser = () => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [LOGGED_IN_USER_INFO, LOGGED_IN_USER_INFO_SUCCESS, LOGGED_IN_USER_INFO_FAILURE],
    endPoint: 'user',
    schema: Schemas.USER,
  },
});

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_PENDING = 'LOGIN_PENDING';

const login = (email, password) => {
  return callOnFetchAccessToken(
    qs.stringify({
      grant_type: 'password',
      username: email,
      password: password,
    }),
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    ACCESS_TOKEN_TYPES.user
  );
};

export const attemptLogin = (email, password) => (dispatch) => {
  dispatch({ type: LOGIN_PENDING });
  dispatch(login(email, password))
    .then((response) => {
      if (response.type === LOGIN_SUCCESS) {
        dispatch(getLoggedInUser());
      }
      if (response.type === LOGIN_FAILURE) {
        Alert.alert('Failed to log in:', response.error);
      }
    })
    .catch((error) => Alert.alert('Network error:', error));
};

export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';

export const invalidateStateAccessToken = () => (dispatch) => {
  dispatch(setAccessToken(UPDATE_ACCESS_TOKEN, getAccessToken() + 'a', getAccessTokenType()));
};
