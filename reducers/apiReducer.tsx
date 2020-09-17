import * as _ from 'lodash';

import {
  LOGGED_IN_USER_INFO_SUCCESS,
  PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE,
  GET_APP_ACCESS_TOKEN_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_ACCESS_TOKEN,
} from '../actions/oauthActions';
import {
  GET_ALL_USERS_SUCCESS,
  GET_SPECIFIC_USER_SUCCESS,
  GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS,
  GET_USER_ID_DOCUMENT_SUCCESS,
  GET_USER_MEDICAL_RECOMMENDATION_SUCCESS,
  VERIFY_USER_DOCUMENT_SUCCESS,
  UPLOAD_USER_DOCUMENT_SUCCESS,
  GET_USERS_BY_SEARCH_SUCCESS,
  GET_ORDER_HISTORY_FOR_USER_SUCCESS,
  CREATE_USER_NOTE_SUCCESS,
  GET_ALL_USER_ID_DOCUMENTS_SUCCESS,
  SET_CURRENT_USER_ID_SUCCESS,
  GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS,
  SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS,
  HIDE_USER_NOTE_SUCCESS,
  UNHIDE_USER_NOTE_SUCCESS,
  ADMIN_CHANGES_USER_DETAILS_SUCCESS,
  HIDE_USER_DOCUMENT_SUCCESS,
  UNHIDE_USER_DOCUMENT_SUCCESS,
} from '../actions/userActions';
// import {
//     CREATE_DSP_SUCCESS, ASSIGN_DSP_MANAGER_SUCCESS, TOGGLE_DSP_MANAGER_ACTIVE_STATUS_SUCCESS,
//     GET_ALL_DSPS_SUCCESS, GET_DSP_SUCCESS
// } from '../actions/dspActions';
// import {
//     CREATE_DSPR_SUCCESS, UPDATE_DSPR_SUCCESS, ASSIGN_DSPR_MANAGER_SUCCESS, TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS,
//     GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS, GET_ALL_DSPRS_FOR_DSP_SUCCESS, GET_DSPR_SUCCESS,
//     TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS, GET_ORDER_HISTORY_FOR_DSPR_SUCCESS,
//     GET_ANALYTICS_FOR_DSPR_SUCCESS,
//     CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS,
//     GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS,
//     HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS,
//     GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS,
//     CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS,
//     UPDATE_DSPR_MENU_MECHANISM_SUCCESS
// } from '../actions/dsprActions';
import {
  ASSIGN_DSPR_DRIVER_SUCCESS,
  TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS,
  SET_DRIVER_LOCATION_SUCCESS,
  SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
  GET_DSPR_DRIVER_SUCCESS,
  SET_DRIVER_INFORMATION_SUCCESS,
  GET_ALL_DRIVERS_FOR_DSPR_SUCCESS,
  SET_DSPR_DRIVER_ID,
  DRIVER_DATA_PENDING,
} from '../actions/driverActions';
// import {
//     CREATE_DSP_PRODUCT_SUCCESS, GET_PRODUCT_SUCCESS, GET_ALL_PRODUCTS_FOR_DSP_SUCCESS, CREATE_NEW_CATEGORY_SUCCESS,
//     GET_PRODUCT_BY_SEARCH_SUCCESS, CREATE_DSP_PRODUCT_FAILURE, GET_PRODUCT_CATEGORIES_FOR_DSP_SUCCESS, GET_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS,
//     POST_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS
// } from '../actions/dspProductActions';
import { CLEAR_API_ERROR_MESSAGE } from '../actions/apiUIHelperActions';
// import {
//     CREATE_INVENTORY_PERIOD_SUCCESS, GET_DRIVER_INVENTORY_PERIOD_SUCCESS, REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS,
//     ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS, TRANSFER_INVENTORY_PERIOD_SUCCESS
// } from '../actions/dsprDriverInventoryPeriodActions';
// import {
//     GET_ALL_ZIP_CODES_FOR_DSPR_SUCCESS, ADD_DSPR_ZIP_CODE_SUCCESS, TOGGLE_DSPR_ZIP_CODE_ACTIVE_STATUS_SUCCESS,
//     ZIP_CODE_MINIMUM_CHANGE_SUCCESS
// } from '../actions/zipCodeActions';
// import {
//     CREATE_NEW_INVENTORY_TRANSACTION_SUCCESS, GET_DSPR_CURRENT_INVENTORY_SUCCESS, SET_DSPR_PRODUCT_PRICE_SUCCESS
// } from '../actions/dsprProductInventoryActions';
// import {
//     CREATE_NEW_COUPON_SUCCESS, GET_DSPR_COUPONS_SUCCESS,
//     SEARCH_DSPR_COUPONS_SUCCESS, TOGGLE_COUPON_ACTIVE_STATUS_SUCCESS
// } from '../actions/couponActions';
import {
  COMPLETE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  MODIFY_ORDER_SUCCESS,
  GET_ORDER_DETAILS_WITH_ID_SUCCESS,
  ORDER_DETAILS_PENDING,
} from '../actions/orderActions';
// import { SEND_TEXT_BLAST_SUCCESS } from '../actions/marketingActions';
// import { GET_METRICS_FOR_USERS_SUCCESS } from '../actions/metricsActions'

import merge from 'lodash/merge';
import entitiesReducer, { initialState as entitiesInitialState } from './entitiesReducer';

const initialState = {
  accessToken: '',
  loggedInUserId: '',
  dsprDriverId: '',
  errorMessage: '',
  isLoading: false,
  entities: entitiesInitialState,
};

export default (state = initialState, action) => {
  console.log('action.type:', action.type);
  switch (action.type) {
    case GET_APP_ACCESS_TOKEN_SUCCESS:
    case UPDATE_ACCESS_TOKEN:
    case LOGIN_SUCCESS:
    case PRELOAD_ACCESS_TOKEN_FROM_LOCAL_STORAGE:
      return { ...state, accessToken: action.accessToken };
    case LOGOUT:
      return {
        ...initialState,
      };
    case LOGGED_IN_USER_INFO_SUCCESS:
      let entities = action.response.entities;
      let usersFromResponse = entities.users;
      let loggedInUserId = Object.keys(usersFromResponse)[0];
      return _.merge({}, state, {
        loggedInUserId,
        errorMessage: '',
        entities: entitiesReducer(state.entities, action),
      });
    case LOGIN_FAILURE:
      return { ...state, errorMessage: 'Login failed.' };
    case SET_DSPR_DRIVER_ID:
      return { ...state, dsprDriverId: action.payload };
    //     case CREATE_DSP_PRODUCT_FAILURE:
    //         return { ...state, errorMessage: action.error };
    //     case GET_USERS_BY_SEARCH_SUCCESS:
    //     case GET_ALL_USERS_SUCCESS:
    //     case CREATE_DSP_SUCCESS:
    //     case CREATE_DSPR_SUCCESS:
    //     case UPDATE_DSPR_SUCCESS:
    //     case ASSIGN_DSPR_MANAGER_SUCCESS:
    //     case ASSIGN_DSP_MANAGER_SUCCESS:
    //     case TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS:
    //     case TOGGLE_DSP_MANAGER_ACTIVE_STATUS_SUCCESS:
    //     case ASSIGN_DSPR_DRIVER_SUCCESS:
    //     case TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS:
    //     case GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS:
    //     case GET_ALL_DSPS_SUCCESS:
    //     case GET_DSP_SUCCESS:
    //     case GET_ALL_DSPRS_FOR_DSP_SUCCESS:
    //     case GET_DSPR_SUCCESS:
    case GET_SPECIFIC_USER_SUCCESS:
    case SET_DRIVER_LOCATION_SUCCESS:
    case SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS:
    //     case GET_PRODUCT_SUCCESS:
    //     case CREATE_DSP_PRODUCT_SUCCESS:
    case GET_DSPR_DRIVER_SUCCESS:
    //     case CREATE_INVENTORY_PERIOD_SUCCESS:
    //     case GET_ALL_ZIP_CODES_FOR_DSPR_SUCCESS:
    //     case ADD_DSPR_ZIP_CODE_SUCCESS:
    //     case TOGGLE_DSPR_ZIP_CODE_ACTIVE_STATUS_SUCCESS:
    //     case GET_ALL_PRODUCTS_FOR_DSP_SUCCESS:
    //     case CREATE_NEW_INVENTORY_TRANSACTION_SUCCESS:
    //     case GET_DSPR_CURRENT_INVENTORY_SUCCESS:
    //     case GET_DRIVER_INVENTORY_PERIOD_SUCCESS:
    //     case GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS:
    //     case REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS:
    //     case ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS:
    case GET_USER_ID_DOCUMENT_SUCCESS:
    case GET_USER_MEDICAL_RECOMMENDATION_SUCCESS:
    case VERIFY_USER_DOCUMENT_SUCCESS:
    //     case SET_DSPR_PRODUCT_PRICE_SUCCESS:
    //     case CREATE_NEW_CATEGORY_SUCCESS:
    //     case CREATE_NEW_COUPON_SUCCESS:
    //     case GET_DSPR_COUPONS_SUCCESS:
    //     case TOGGLE_COUPON_ACTIVE_STATUS_SUCCESS:
    case COMPLETE_ORDER_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
    //     case TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS:
    //     case GET_ORDER_HISTORY_FOR_DSPR_SUCCESS:
    //     case UPLOAD_USER_DOCUMENT_SUCCESS:
    //     case SEND_TEXT_BLAST_SUCCESS:
    //     case ZIP_CODE_MINIMUM_CHANGE_SUCCESS:
    //     case TRANSFER_INVENTORY_PERIOD_SUCCESS:
    //     case GET_ORDER_HISTORY_FOR_USER_SUCCESS:
    //     case GET_ANALYTICS_FOR_DSPR_SUCCESS:
    //     case SEARCH_DSPR_COUPONS_SUCCESS:
    //     case GET_PRODUCT_BY_SEARCH_SUCCESS:
    //     case CREATE_USER_NOTE_SUCCESS:
    case SET_DRIVER_INFORMATION_SUCCESS:
    case SET_CURRENT_USER_ID_SUCCESS:
    case SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS:
    //     case GET_ALL_DRIVERS_FOR_DSPR_SUCCESS:
    //     case MODIFY_ORDER_SUCCESS:
    case GET_ORDER_DETAILS_WITH_ID_SUCCESS:
    case HIDE_USER_NOTE_SUCCESS:
    case UNHIDE_USER_NOTE_SUCCESS:
    case HIDE_USER_DOCUMENT_SUCCESS:
    case UNHIDE_USER_DOCUMENT_SUCCESS:
      //     case ADMIN_CHANGES_USER_DETAILS_SUCCESS:
      //     case GET_PRODUCT_CATEGORIES_FOR_DSP_SUCCESS:
      //     case CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS:
      //     case GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS:
      //     case HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS:
      //     case GET_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS:
      //     case POST_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS:
      //     case GET_METRICS_FOR_USERS_SUCCESS:
      //     case GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS:
      //     case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
      //     case UPDATE_DSPR_MENU_MECHANISM_SUCCESS:
      const newState = { ...state, isLoading: false, entities: entitiesInitialState };
      return merge({}, newState, {
        entities: entitiesReducer(state.entities, action),
      });
    case GET_ALL_USER_ID_DOCUMENTS_SUCCESS:
      const newEntitiesState = { ...state, entities: { ...state.entities, usersIdDocuments: {} } };
      return merge({}, newEntitiesState, {
        entities: entitiesReducer(newEntitiesState.entities, action),
      });
    case GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS:
      const newStateWithoutMedicalRecommendations = {
        ...state,
        entities: { ...state.entities, usersMedicalRecommendations: {} },
      };
      return merge({}, newStateWithoutMedicalRecommendations, {
        entities: entitiesReducer(newStateWithoutMedicalRecommendations.entities, action),
      });
    case DRIVER_DATA_PENDING:
    case ORDER_DETAILS_PENDING:
      return { ...state, isLoading: true };
    case CLEAR_API_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    // case MODIFY_ORDER_SUCCESS:
    //     return merge({}, state, { entities: entitiesReducer(state.entities, action) });
    default:
      return state;
  }
};
