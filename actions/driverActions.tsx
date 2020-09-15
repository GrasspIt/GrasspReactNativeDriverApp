import { CALL_API, Schemas } from '../middleware/api';

import { getSpecificUser } from './userActions';
import { getDSPR } from './dsprActions';
import * as RootNavigation from '../navigation/RootNavigation';

export const ASSIGN_DSPR_DRIVER = 'ASSIGN_DSPR_DRIVER';
export const ASSIGN_DSPR_DRIVER_SUCCESS = 'ASSIGN_DSPR_DRIVER_SUCCESS';
export const ASSIGN_DSPR_DRIVER_FAILURE = 'ASSIGN_DSPR_DRIVER_FAILURE';

const dsprDriverAssigner = (dsprId, driverUserId, onCall) => {
  const dsprDriver = {
    dspr: {
      id: dsprId,
    },
    user: {
      id: driverUserId,
    },
    onCall: onCall === undefined ? false : onCall,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [ASSIGN_DSPR_DRIVER, ASSIGN_DSPR_DRIVER_SUCCESS, ASSIGN_DSPR_DRIVER_FAILURE],
      endPoint: 'dspr/driver',
      schema: Schemas.DSPR_DRIVER,
      body: dsprDriver,
    },
  };
};

export const assignDSPRDriver = (dsprId, driverUserId, onCall) => (dispatch, getState) => {
  return dispatch(dsprDriverAssigner(dsprId, driverUserId, onCall))
    .then(() => dispatch(getDSPR(dsprId)))
    .then(() => dispatch(getSpecificUser(driverUserId)));
};

export const SET_DSPR_DRIVER_ID = 'SET_DSPR_DRIVER_ID';
export const GET_DSPR_DRIVER = 'GET_DSPR_DRIVER';
export const GET_DSPR_DRIVER_SUCCESS = 'GET_DSPR_DRIVER_SUCCESS';
export const GET_DSPR_DRIVER_FAILURE = 'GET_DSPR_DRIVER_FAILURE';

const dsprDriverGetter = (dsprDriverId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [GET_DSPR_DRIVER, GET_DSPR_DRIVER_SUCCESS, GET_DSPR_DRIVER_FAILURE],
      endPoint: `dspr/driver/${dsprDriverId}`,
      schema: Schemas.DSPR_DRIVER,
    },
  };
};

const setDriverId = (driverId) => {
  return { type: SET_DSPR_DRIVER_ID, payload: driverId };
};

export const setDsprDriverId = (dsprDriverId) => (dispatch) => {
  dispatch(setDriverId(dsprDriverId));
  RootNavigation.navigate('Main', {
    screen: 'Dashboard',
  });
};

export const getDSPRDriver = (dsprDriverId) => (dispatch, getState) => {
  return dispatch(dsprDriverGetter(dsprDriverId)).then((response) => {
    return response;
  });
};

export const GET_ALL_DRIVERS_FOR_DSPR = 'GET_ALL_DRIVERS_FOR_DSPR';
export const GET_ALL_DRIVERS_FOR_DSPR_SUCCESS = 'GET_ALL_DRIVERS_FOR_DSPR_SUCCESS';
export const GET_ALL_DRIVERS_FOR_DSPR_FAILURE = 'GET_ALL_DRIVERS_FOR_DSPR_FAILURE';

const allDriversForDsprGetter = (dsprId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ALL_DRIVERS_FOR_DSPR,
        GET_ALL_DRIVERS_FOR_DSPR_SUCCESS,
        GET_ALL_DRIVERS_FOR_DSPR_FAILURE,
      ],
      endPoint: `dspr/driver/`,
      schema: Schemas.DSPR_DRIVER_ARRAY,
      queryParamsMap: { dspr_id: dsprId },
    },
  };
};

export const getAllDriversForDspr = (dsprId) => (dispatch) => {
  return dispatch(allDriversForDsprGetter(dsprId));
};

export const TOGGLE_DSPR_DRIVER_ACTIVE_STATUS = 'TOGGLE_DSPR_DRIVER_ACTIVE_STATUS';
export const TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS = 'TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS';
export const TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_FAILURE = 'TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_FAILURE';

const dsprDriverActiveStatusToggler = (dsprDriverId, isCurrentlyActive) => {
  const dsprDriver = {
    id: dsprDriverId,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        TOGGLE_DSPR_DRIVER_ACTIVE_STATUS,
        TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS,
        TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_FAILURE,
      ],
      endPoint: isCurrentlyActive ? 'dspr/driver/deactivate' : 'dspr/driver/activate',
      schema: Schemas.DSPR_DRIVER,
      body: dsprDriver,
    },
  };
};

export const toggleDSPRDriverActiveStatus = (dsprDriverId) => (dispatch, getState) => {
  return dispatch(
    dsprDriverActiveStatusToggler(
      dsprDriverId,
      getState().api.entities.dsprDrivers[dsprDriverId].active
    )
  );
};

export const SET_ON_CALL_STATE_FOR_DRIVER = 'SET_ON_CALL_STATE_FOR_DRIVER';
export const SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS = 'SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS';
export const SET_ON_CALL_STATE_FOR_DRIVER_FAILURE = 'SET_ON_CALL_STATE_FOR_DRIVER_FAILURE';

const driverOnCallStateSetter = (dsprDriverId, onCallString) => {
  const dsprDriver = {
    id: dsprDriverId,
  };

  const endpointString = onCallString === 'on' ? 'oncall' : 'notoncall';

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        SET_ON_CALL_STATE_FOR_DRIVER,
        SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
        SET_ON_CALL_STATE_FOR_DRIVER_FAILURE,
      ],
      endPoint: 'dspr/driver/' + endpointString,
      schema: Schemas.DSPR_DRIVER,
      body: dsprDriver,
    },
  };
};

export const setDriverOnCallState = (dsprDriverId, isOnCall) => (dispatch, getState) => {
  return dispatch(driverOnCallStateSetter(dsprDriverId, isOnCall));
};

export const SET_DRIVER_LOCATION = 'SET_DRIVER_LOCATION';
export const SET_DRIVER_LOCATION_SUCCESS = 'SET_DRIVER_LOCATION_SUCCESS';
export const SET_DRIVER_LOCATION_FAILURE = 'SET_DRIVER_LOCATION_FAILURE';

const driverLocationSetter = (dsprId, latitude, longitude) => {
  const driverLocation = {
    longitude,
    latitude,
    dspr: {
      id: dsprId,
    },
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [SET_DRIVER_LOCATION, SET_DRIVER_LOCATION_SUCCESS, SET_DRIVER_LOCATION_FAILURE],
      endPoint: 'dspr/driver/location',
      schema: Schemas.DSPR_DRIVER_LOCATION,
      body: driverLocation,
    },
  };
};

export const SET_DRIVER_INFORMATION = 'SET_DRIVER_INFORMATION';
export const SET_DRIVER_INFORMATION_SUCCESS = 'SET_DRIVER_INFORMATION_SUCCESS';
export const SET_DRIVER_INFORMATION_FAILURE = 'SET_DRIVER_INFORMATION_FAILURE';

export const setDriverLocation = (dsprId, latitude, longitude) => (dispatch, getState) => {
  return dispatch(driverLocationSetter(dsprId, latitude, longitude));
};

const driverInformationSetter = (dsprDriverId, values) => {
  const information = {
    id: dsprDriverId,
    ...values,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        SET_DRIVER_INFORMATION,
        SET_DRIVER_INFORMATION_SUCCESS,
        SET_DRIVER_INFORMATION_FAILURE,
      ],
      endPoint: 'dspr/driver/update',
      schema: Schemas.DSPR_DRIVER,
      body: information,
    },
  };
};
export const setUpdateDriverInformation = (dsprDriverId, values) => (dispatch, getState) => {
  return dispatch(driverInformationSetter(dsprDriverId, values));
};
