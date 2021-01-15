import * as _ from 'lodash';
import { LOGGED_IN_USER_INFO_SUCCESS } from '../actions/oauthActions';
import {
  GET_SPECIFIC_USER_SUCCESS,
  GET_USER_ID_DOCUMENT_SUCCESS,
  GET_USER_MEDICAL_RECOMMENDATION_SUCCESS,
  CREATE_USER_NOTE_SUCCESS,
  GET_ALL_USER_ID_DOCUMENTS_SUCCESS,
  SET_CURRENT_USER_ID_SUCCESS,
  GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS,
  SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS,
  HIDE_USER_NOTE_SUCCESS,
  UNHIDE_USER_NOTE_SUCCESS,
  SEND_PUSH_TOKEN_SUCCESS,
  HIDE_USER_DOCUMENT_SUCCESS,
  UNHIDE_USER_DOCUMENT_SUCCESS,
} from '../actions/userActions';
import {
  GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS,
  CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS,
} from '../actions/dsprActions';
import {
  TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS,
  SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS,
  SET_DRIVER_LOCATION_SUCCESS,
  GET_DSPR_DRIVER_SUCCESS,
  CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS,
  PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS,
  CREATE_NEW_DSPR_DRIVER_ROUTE_WITHOUT_NOTIFICATIONS_SUCCESS,
  DEACTIVATE_DSPR_DRIVER_ROUTE_SUCCESS,
} from '../actions/driverActions';
import {
  CREATE_INVENTORY_PERIOD_SUCCESS,
  GET_DRIVER_INVENTORY_PERIOD_SUCCESS,
  REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS,
  ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS,
  TRANSFER_INVENTORY_PERIOD_SUCCESS,
} from '../actions/dsprDriverInventoryPeriodActions';
import {
  COMPLETE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  GET_ORDER_DETAILS_WITH_ID_SUCCESS,
} from '../actions/orderActions';

export const initialState = {
  users: {},
  pushToken: {},
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
  dsprDriverRoutes: {},
  dsprDriverRouteLegs: {},
  dsprDriverRouteLegDirections: {},
  dsprDriverRouteLocations: {},
  dsprDriverRouteMetrics: {},
};

export const overwriteArray = (objValue, srcValue) => {
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
    newState[entityType] = _.merge({}, oldStateTypeEntities, entitiesInResponse);
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
    newState[entityType] = _.mergeWith(
      {},
      oldStateTypeEntities,
      entitiesInResponse,
      overwriteArray
    );
  });
  return newState;
};

export default (state = initialState, action) => {
  let responseEntities = action.response.entities;
  switch (action.type) {
    case LOGGED_IN_USER_INFO_SUCCESS:
    case TOGGLE_DSPR_DRIVER_ACTIVE_STATUS_SUCCESS:
    case GET_SPECIFIC_USER_SUCCESS:
    case SET_ON_CALL_STATE_FOR_DRIVER_SUCCESS:
    case SET_DRIVER_LOCATION_SUCCESS:
    case GET_DRIVER_INVENTORY_PERIOD_SUCCESS:
    case ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS:
    case GET_USER_ID_DOCUMENT_SUCCESS:
    case GET_USER_MEDICAL_RECOMMENDATION_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
    case TRANSFER_INVENTORY_PERIOD_SUCCESS:
    case CREATE_USER_NOTE_SUCCESS:
    case GET_ORDER_DETAILS_WITH_ID_SUCCESS:
    case HIDE_USER_NOTE_SUCCESS:
    case UNHIDE_USER_NOTE_SUCCESS:
    case HIDE_USER_DOCUMENT_SUCCESS:
    case UNHIDE_USER_DOCUMENT_SUCCESS:
    case SEND_PUSH_TOKEN_SUCCESS:
    case COMPLETE_ORDER_SUCCESS:
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    case REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS:
    case GET_ALL_USER_ID_DOCUMENTS_SUCCESS:
    case GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS:
    case GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS:
    case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
    case PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS:
    case CREATE_NEW_DSPR_DRIVER_ROUTE_WITHOUT_NOTIFICATIONS_SUCCESS:
    case DEACTIVATE_DSPR_DRIVER_ROUTE_SUCCESS:
      return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(state, responseEntities);
    case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
      const dsprServiceAreaFromResponse: any =
        responseEntities && responseEntities.dsprDriverServiceAreas
          ? Object.values(responseEntities.dsprDriverServiceAreas)[0]
          : undefined;
      const stateWithoutDSPRDriverServiceArea = dsprServiceAreaFromResponse
        ? {
            ...state,
            dsprDriverServiceAreas: {
              ...state.dsprDriverServiceAreas,
              [dsprServiceAreaFromResponse.id]: {
                ...dsprServiceAreaFromResponse,
              },
            },
          }
        : state;
      return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(
        stateWithoutDSPRDriverServiceArea,
        responseEntities
      );
    case GET_DSPR_DRIVER_SUCCESS:
      const dsprDriverId = Object.keys(responseEntities.dsprDrivers)[0];
      let oldDsprDrivers = state.dsprDrivers;
      oldDsprDrivers[dsprDriverId] = {};
      const routeId = oldDsprDrivers[dsprDriverId].currentRoute;
      let oldRoutes = state.dsprDriverRoutes;
      if (routeId !== undefined) oldRoutes[routeId] = {};
      state = { ...state, dsprDrivers: oldDsprDrivers, dsprDriverRoutes: oldRoutes };
      return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(state, responseEntities);
    case SET_CURRENT_USER_ID_SUCCESS:
      const idUserKey = Object.keys(responseEntities.users)[0];
      responseEntities.users[idUserKey].identificationDocument = action.response.result;
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    case SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS:
      const recommendationUserKey = Object.keys(responseEntities.users)[0];
      responseEntities.users[recommendationUserKey].medicalRecommendation = action.response.result;
      return appendAndUpdateEntitiesFromResponse(state, responseEntities);
    default:
      return state;
  }
};
