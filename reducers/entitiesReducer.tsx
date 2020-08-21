import * as _ from 'lodash';
import { LOGGED_IN_USER_INFO_SUCCESS } from '../actions/oauthActions';
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
//     CREATE_DSP_SUCCESS, TOGGLE_DSP_MANAGER_ACTIVE_STATUS_SUCCESS, ASSIGN_DSP_MANAGER_SUCCESS,
//     GET_ALL_DSPS_SUCCESS, GET_DSP_SUCCESS
// } from '../actions/dspActions';
// import {
//     CREATE_DSPR_SUCCESS, TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS, ASSIGN_DSPR_MANAGER_SUCCESS,
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
  SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
  SET_DRIVER_LOCATION_SUCCESS,
  GET_DSPR_DRIVER_SUCCESS,
  SET_DRIVER_INFORMATION_SUCCESS,
  GET_ALL_DRIVERS_FOR_DSPR_SUCCESS,
} from '../actions/driverActions';
// import {
//     CREATE_DSP_PRODUCT_SUCCESS, GET_PRODUCT_SUCCESS, GET_ALL_PRODUCTS_FOR_DSP_SUCCESS, POST_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS,
//     CREATE_NEW_CATEGORY_SUCCESS, GET_PRODUCT_BY_SEARCH_SUCCESS, GET_PRODUCT_CATEGORIES_FOR_DSP_SUCCESS, GET_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS
// } from '../actions/dspProductActions';
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
//     CREATE_NEW_COUPON_SUCCESS, GET_DSPR_COUPONS_SUCCESS, TOGGLE_COUPON_ACTIVE_STATUS_SUCCESS, SEARCH_DSPR_COUPONS_SUCCESS
// } from '../actions/couponActions'
// import { COMPLETE_ORDER_SUCCESS, CANCEL_ORDER_SUCCESS, MODIFY_ORDER_SUCCESS, GET_ORDER_DETAILS_WITH_ID_SUCCESS} from '../actions/orderActions';
// import { SEND_TEXT_BLAST_SUCCESS } from '../actions/marketingActions';
// import { GET_METRICS_FOR_USERS_SUCCESS } from '../actions/metricsActions'

// import { merge, mergeWith, isArray } from 'lodash';
// import { DSPRDriverServiceArea } from '../store/reduxStoreState';

export const initialState = {
  users: {},
  unverifiedUsers: {},
  searchUsers: {},
  deliveryServiceProviders: {},
  dspManagers: {},
  DSPRs: {},
  dsprManagers: {},
  dsprDrivers: {},
  dsprDriverLocations: {},
  dsprDriverInventoryPeriods: {},
  dsprDriverInventoryItems: {},
  dsprProductInventoryTransactions: {},
  dsprCurrentInventoryItems: {},
  dsprZipCodes: {},
  usersIdDocuments: {},
  usersMedicalRecommendations: {},
  dsprProductPriceHistories: {},
  dspProductCategories: {},
  dsprProductCategoryPromotions: {},
  coupons: {},
  orders: {},
  addresses: {},
  dsprOrderHistories: {},
  textBlasts: {},
  userNotes: {},
  searchProducts: {},
  dsprDriverServiceAreas: {},
  dsprDriverServiceAreaVertices: {},
  metrics: {},
};

const overwriteArray = (objValue, srcValue) => {
  if (_.isArray(srcValue)) return srcValue;
};

const appendAndUpdateEntitiesFromResponse = (
  oldState,
  responseEntities,
  skipEntityTypes: string[] = []
) => {
  let newState = _.merge({}, oldState);
  Object.keys(responseEntities).forEach((entityType) => {
    if (skipEntityTypes.includes(entityType)) return;
    let oldStateTypeEntities = oldState[entityType];
    let entitiesInResponse = responseEntities[entityType];
    newState[entityType] = _.merge(oldStateTypeEntities, entitiesInResponse);
  });
  return newState;
};

const appendAndUpdateEntitiesFromResponseWithArrayOverwrite = (
  oldState,
  responseEntities,
  skipEntityTypes: string[] = []
) => {
  let newState = _.merge({}, oldState);
  Object.keys(responseEntities).forEach((entityType) => {
    if (skipEntityTypes.includes(entityType)) return;
    let oldStateTypeEntities = oldState[entityType];
    let entitiesInResponse = responseEntities[entityType];
    newState[entityType] = _.mergeWith(oldStateTypeEntities, entitiesInResponse, overwriteArray);
  });
  return newState;
};

export default (state = initialState, action) => {
  let responseEntities = action.response.entities;
  switch (action.type) {
    case LOGGED_IN_USER_INFO_SUCCESS:
    // case GET_ALL_USERS_SUCCESS:
    // case CREATE_DSP_SUCCESS:
    // case CREATE_DSPR_SUCCESS:
    // case TOGGLE_DSP_MANAGER_ACTIVE_STATUS_SUCCESS:
    // case ASSIGN_DSP_MANAGER_SUCCESS:
    // case TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS:
    // case ASSIGN_DSPR_MANAGER_SUCCESS:
    // case ASSIGN_DSPR_DRIVER_SUCCESS:
    // case TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS:
    // case GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS:
    // case GET_ALL_DSPS_SUCCESS:
    // case GET_DSP_SUCCESS:
    // case GET_ALL_DSPRS_FOR_DSP_SUCCESS:
    // case GET_SPECIFIC_USER_SUCCESS:
    // case GET_PRODUCT_SUCCESS:
    // case CREATE_DSP_PRODUCT_SUCCESS:
    case SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS:
    case SET_DRIVER_LOCATION_SUCCESS:
      // case CREATE_INVENTORY_PERIOD_SUCCESS:
      // case GET_ALL_ZIP_CODES_FOR_DSPR_SUCCESS:
      // case ADD_DSPR_ZIP_CODE_SUCCESS:
      // case TOGGLE_DSPR_ZIP_CODE_ACTIVE_STATUS_SUCCESS:
      // case GET_ALL_PRODUCTS_FOR_DSP_SUCCESS:
      // case CREATE_NEW_INVENTORY_TRANSACTION_SUCCESS:
      // case GET_DSPR_CURRENT_INVENTORY_SUCCESS:
      // case GET_DRIVER_INVENTORY_PERIOD_SUCCESS:
      // case GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS:
      // case ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS:
      // case GET_USER_ID_DOCUMENT_SUCCESS:
      // case GET_USER_MEDICAL_RECOMMENDATION_SUCCESS:
      // case VERIFY_USER_DOCUMENT_SUCCESS:
      // case SET_DSPR_PRODUCT_PRICE_SUCCESS:
      // case CREATE_NEW_CATEGORY_SUCCESS:
      // case CREATE_NEW_COUPON_SUCCESS:
      // case GET_DSPR_COUPONS_SUCCESS:
      // case TOGGLE_COUPON_ACTIVE_STATUS_SUCCESS:
      // case COMPLETE_ORDER_SUCCESS:
      // case CANCEL_ORDER_SUCCESS:
      // case TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS:
      // case UPLOAD_USER_DOCUMENT_SUCCESS:
      // case SEND_TEXT_BLAST_SUCCESS:
      // case TRANSFER_INVENTORY_PERIOD_SUCCESS:
      // case GET_ANALYTICS_FOR_DSPR_SUCCESS:
      // case CREATE_USER_NOTE_SUCCESS:
      // case SET_DRIVER_INFORMATION_SUCCESS:
      // case GET_ORDER_DETAILS_WITH_ID_SUCCESS:
      // case HIDE_USER_NOTE_SUCCESS:
      // case UNHIDE_USER_NOTE_SUCCESS:
      // case HIDE_USER_DOCUMENT_SUCCESS:
      // case UNHIDE_USER_DOCUMENT_SUCCESS:
      // case ADMIN_CHANGES_USER_DETAILS_SUCCESS:
      // case GET_PRODUCT_CATEGORIES_FOR_DSP_SUCCESS:
      // case CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS:
      // case GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS:
      // case HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS:
      // case GET_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS:
      // case POST_DSPR_PRODUCT_CATEGORIES_WITH_ORDER_SUCCESS:
      // case GET_METRICS_FOR_USERS_SUCCESS:
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    // case GET_DSPR_SUCCESS:
    // case REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS:
    // case GET_ORDER_HISTORY_FOR_DSPR_SUCCESS:
    // case GET_ORDER_HISTORY_FOR_USER_SUCCESS:
    // case GET_ALL_USER_ID_DOCUMENTS_SUCCESS:
    // case GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS:
    // case GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS:
    // case UPDATE_DSPR_MENU_MECHANISM_SUCCESS:
    // case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
    // return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(state, responseEntities);

    // case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
    //     const dsprServiceAreaFromResponse:any = responseEntities && responseEntities.dsprDriverServiceAreas ? Object.values(responseEntities.dsprDriverServiceAreas)[0]: undefined;
    //     const stateWithoutDSPRDriverServiceArea = dsprServiceAreaFromResponse ? {
    //         ...state,
    //         dsprDriverServiceAreas: {
    //             ...state.dsprDriverServiceAreas,
    //             [dsprServiceAreaFromResponse.id]: {
    //                 ...dsprServiceAreaFromResponse
    //             }
    //         }
    //     } : state
    //     return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(stateWithoutDSPRDriverServiceArea, responseEntities);

    // case GET_ALL_DRIVERS_FOR_DSPR_SUCCESS:
    //     const dsprFromResponse = responseEntities && responseEntities.DSPRs ? Object.values(responseEntities.DSPRs)[0] as { id: number } : undefined;
    //     const driverIdsForDspr = action.response.result;
    //     const stateWithDsprDriverIdArray = dsprFromResponse ? {
    //         ...state,
    //         DSPRs: {
    //             ...state.DSPRs,
    //             [dsprFromResponse.id]: {
    //                 ...dsprFromResponse,
    //                 drivers: driverIdsForDspr
    //             },
    //         },
    //     }: state;
    //     return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(stateWithDsprDriverIdArray, responseEntities);
    // case ZIP_CODE_MINIMUM_CHANGE_SUCCESS:
    //     const zipCodeId = Object.keys(responseEntities.dsprZipCodes)[0];
    //     let oldZipCodes = state.dsprZipCodes;
    //     oldZipCodes[zipCodeId] = {};
    //     state = { ...state, dsprZipCodes: oldZipCodes };
    //     return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    case GET_DSPR_DRIVER_SUCCESS:
      const dsprDriverId = Object.keys(responseEntities.dsprDrivers)[0];
      let oldDsprDrivers = state.dsprDrivers;
      oldDsprDrivers[dsprDriverId] = {};
      state = { ...state, dsprDrivers: oldDsprDrivers };
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    case SET_CURRENT_USER_ID_SUCCESS:
      const idUserKey = Object.keys(responseEntities.users)[0];
      responseEntities.users[idUserKey].identificationDocument = action.response.result;
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    // case SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS:
    //     const recommendationUserKey = Object.keys(responseEntities.users)[0];
    //     responseEntities.users[recommendationUserKey].medicalRecommendation = action.response.result;
    //     return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    // case MODIFY_ORDER_SUCCESS:
    //     const modifiedState = merge({},state);
    //     const oldOrderId = responseEntities.orders[action.response.result].modifiedOrder.id;
    //     const dsprId = responseEntities.orders[action.response.result].dspr
    //     const transfereeDriverId = modifiedState.orders[oldOrderId].dsprDriver
    //     const currentInProcessOrder = modifiedState.dsprDrivers[transfereeDriverId].currentInProcessOrder
    //     if (oldOrderId === currentInProcessOrder) {
    //         delete modifiedState.dsprDrivers[transfereeDriverId].currentInProcessOrder
    //     } else {
    //         const queuedOrders = modifiedState.dsprDrivers[transfereeDriverId].queuedOrders
    //         const deletionIndex = modifiedState.dsprDrivers[transfereeDriverId].queuedOrders.indexOf(oldOrderId)
    //         queuedOrders.splice(deletionIndex,1)
    //         queuedOrders.push(action.response.result)
    //     }
    //     delete modifiedState.orders[oldOrderId]
    //     if (modifiedState.dsprOrderHistories[dsprId] &&
    //             modifiedState.dsprOrderHistories[dsprId].orders.indexOf(oldOrderId)) {
    //         const ordersHistoryForDspr = modifiedState.dsprOrderHistories[dsprId]
    //         const orderIndex = modifiedState.dsprOrderHistories[dsprId].orders.indexOf(oldOrderId)
    //         ordersHistoryForDspr.orders.splice(orderIndex,1)
    //         ordersHistoryForDspr.orders.push(action.response.result)
    //     }
    //     return appendAndUpdateEntitiesFromResponse(modifiedState, responseEntities)
    // case GET_USERS_BY_SEARCH_SUCCESS:
    //     return { ...state, searchUsers: responseEntities.searchUsers };
    // case GET_PRODUCT_BY_SEARCH_SUCCESS:
    //     return { ...state, searchProducts: responseEntities.searchProducts };
    // case SEARCH_DSPR_COUPONS_SUCCESS:
    //     return { ...state, coupons: responseEntities.coupons };
    default:
      return state;
  }
};
