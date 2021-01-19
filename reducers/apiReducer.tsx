import * as _ from 'lodash';
import {
  LOGGED_IN_USER_INFO_SUCCESS,
  LOGGED_IN_USER_INFO_FAILURE,
  PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE,
  GET_APP_ACCESS_TOKEN_SUCCESS,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_ACCESS_TOKEN,
} from '../actions/oauthActions';
import {
  GET_SPECIFIC_USER_SUCCESS,
  GET_USER_ID_DOCUMENT_SUCCESS,
  GET_USER_MEDICAL_RECOMMENDATION_SUCCESS,
  CREATE_USER_NOTE_SUCCESS,
  HIDE_USER_NOTE_SUCCESS,
  UNHIDE_USER_NOTE_SUCCESS,
  HIDE_USER_DOCUMENT_SUCCESS,
  UNHIDE_USER_DOCUMENT_SUCCESS,
  SEND_PUSH_TOKEN_SUCCESS,
} from '../actions/userActions';
import {
  GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS,
  CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS,
} from '../actions/dsprActions';
import {
  TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS,
  SET_DRIVER_LOCATION_SUCCESS,
  SET_ON_CALL_STATE_FOR_DRIVER_PENDING,
  SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
  GET_DSPR_DRIVER_SUCCESS,
  SET_DSPR_DRIVER_ID,
  DRIVER_DATA_PENDING,
  GET_DSPR_DRIVER_FAILURE,
  CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS,
  PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS,
  CREATE_NEW_DSPR_DRIVER_ROUTE_PENDING,
  PROGRESS_DSPR_DRIVER_ROUTE_PENDING,
  CREATE_NEW_DSPR_DRIVER_ROUTE_FAILURE,
  PROGRESS_DSPR_DRIVER_ROUTE_FAILURE,
  SET_ON_CALL_STATE_FOR_DRIVER_FAILURE,
  CREATE_NEW_DSPR_DRIVER_ROUTE_WITHOUT_NOTIFICATIONS_SUCCESS,
  DEACTIVATE_DSPR_DRIVER_ROUTE_SUCCESS,
  REMOVE_ORDER_AND_REFRESH_ROUTE_PENDING,
} from '../actions/driverActions';
import {
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILURE,
  COMPLETE_ORDER_PENDING,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  CANCEL_ORDER_PENDING,
  GET_ORDER_DETAILS_WITH_ID_SUCCESS,
  GET_ORDER_DETAILS_WITH_ID_FAILURE,
  ORDER_DETAILS_PENDING,
  MARK_IN_PROCESS_FAILURE,
  MARK_IN_PROCESS_PENDING,
} from '../actions/orderActions';

import entitiesReducer, { initialState as entitiesInitialState } from './entitiesReducer';

export const initialState = {
  accessToken: '',
  loggedInUserId: '',
  dsprDriverId: '',
  isLoading: false,
  entities: entitiesInitialState,
};

export default (state = initialState, action) => {
  switch (action.type) {
    // actions pending
    case LOGIN_PENDING:
    case DRIVER_DATA_PENDING:
    case ORDER_DETAILS_PENDING:
    case COMPLETE_ORDER_PENDING:
    case CANCEL_ORDER_PENDING:
    case MARK_IN_PROCESS_PENDING:
    case SET_ON_CALL_STATE_FOR_DRIVER_PENDING:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_PENDING:
    case PROGRESS_DSPR_DRIVER_ROUTE_PENDING:
    case REMOVE_ORDER_AND_REFRESH_ROUTE_PENDING:
      return { ...state, isLoading: true };

    // actions failed
    case GET_DSPR_DRIVER_FAILURE:
    case GET_ORDER_DETAILS_WITH_ID_FAILURE:
    case PROGRESS_DSPR_DRIVER_ROUTE_FAILURE:
    case SET_ON_CALL_STATE_FOR_DRIVER_FAILURE:
    case LOGIN_FAILURE:
    case MARK_IN_PROCESS_FAILURE:
    case COMPLETE_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_FAILURE:
      return { ...state, isLoading: false };

    // actions succeeded
    case SET_DSPR_DRIVER_ID:
      return { ...state, dsprDriverId: action.payload };
    case GET_APP_ACCESS_TOKEN_SUCCESS:
    case UPDATE_ACCESS_TOKEN:
    case LOGIN_SUCCESS:
    case PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE:
      return { ...state, isLoading: true, accessToken: action.accessToken };
    case LOGGED_IN_USER_INFO_SUCCESS:
      let entities = action.response.entities;
      let usersFromResponse = entities.users;
      let loggedInUserId = Object.keys(usersFromResponse)[0];
      return _.merge({}, state, {
        loggedInUserId,
        isLoading: false,
        entities: entitiesReducer(state.entities, action),
      });
    case GET_SPECIFIC_USER_SUCCESS:
    case SET_DRIVER_LOCATION_SUCCESS:
    case SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS:
    case GET_DSPR_DRIVER_SUCCESS:
    case GET_USER_ID_DOCUMENT_SUCCESS:
    case GET_USER_MEDICAL_RECOMMENDATION_SUCCESS:
    case COMPLETE_ORDER_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
    case CREATE_USER_NOTE_SUCCESS:
    case GET_ORDER_DETAILS_WITH_ID_SUCCESS:
    case HIDE_USER_NOTE_SUCCESS:
    case UNHIDE_USER_NOTE_SUCCESS:
    case HIDE_USER_DOCUMENT_SUCCESS:
    case UNHIDE_USER_DOCUMENT_SUCCESS:
    case SEND_PUSH_TOKEN_SUCCESS:
    case GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS:
    case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS:
    case PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_WITHOUT_NOTIFICATIONS_SUCCESS:
    case DEACTIVATE_DSPR_DRIVER_ROUTE_SUCCESS:
      const newState = { ...state, isLoading: false, entities: { ...entitiesInitialState } };
      return _.merge({}, newState, {
        entities: entitiesReducer(state.entities, action),
      });
    case LOGOUT:
      return {
        ...initialState,
        entities: { ...entitiesInitialState },
      };
    default:
      return state;
  }
};
