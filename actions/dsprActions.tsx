import { CALL_API, Schemas, API_ROOT } from '../middleware/api';
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from './oauthActions';

// import { getDSP } from './dspActions';
import { getSpecificUser } from './userActions';

export const CREATE_DSPR = 'CREATE_DSPR';
export const CREATE_DSPR_SUCCESS = 'CREATE_DSPR_SUCCESS';
export const CREATE_DSPR_FAILURE = 'CREATE_DSPR_FAILURE';

//TODO: operating hours
const dsprCreator = (
  name,
  managerUserId,
  dspId,
  minimumOrderSize,
  centralLatitude,
  centralLongitude
) => {
  const dsprManager = {
    dspr: {
      name,
      deliveryServiceProvider: {
        id: dspId,
      },
      minimumOrderSize,
      centralLatitude,
      centralLongitude,
    },
    user: {
      id: managerUserId,
    },
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [CREATE_DSPR, CREATE_DSPR_SUCCESS, CREATE_DSPR_FAILURE],
      endPoint: 'dspr',
      schema: Schemas.DSPR,
      body: dsprManager,
    },
  };
};

// export const createDSPR = (name, managerUserId, dspId, minimumOrderSize, centralLatitude, centralLongitude) => (dispatch, getState) => {
//     return dispatch(dsprCreator(name, managerUserId, dspId, minimumOrderSize, centralLatitude, centralLongitude))
//         .then(() => dispatch(getDSP(dspId))).then(() => dispatch(getSpecificUser(managerUserId)));
// };

export const UPDATE_DSPR = 'UPDATE_DSPR';
export const UPDATE_DSPR_SUCCESS = 'UPDATE_DSPR_SUCCESS';
export const UPDATE_DSPR_FAILURE = 'UPDATE_DSPR_FAILURE';

const dsprUpdate = (
  name,
  displayName,
  dspId,
  minimumOrderSize,
  centralLatitude,
  centralLongitude,
  dsprId,
  imageFile
) => {
  const dsprUpdate = {
    name,
    displayName,
    deliveryServiceProvider: {
      id: dspId,
    },
    minimumOrderSize,
    centralLatitude,
    centralLongitude,
    id: dsprId,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [UPDATE_DSPR, UPDATE_DSPR_SUCCESS, UPDATE_DSPR_FAILURE],
      endPoint: 'dspr/update',
      schema: Schemas.DSPR,
      body: dsprUpdate,
      file: imageFile,
    },
  };
};

export const updateDSPR = (
  name,
  displayName,
  dspId,
  minimumOrderSize,
  centralLatitude,
  centralLongitude,
  dsprId,
  imageFile
) => (dispatch, getState) => {
  return dispatch(
    dsprUpdate(
      name,
      displayName,
      dspId,
      minimumOrderSize,
      centralLatitude,
      centralLongitude,
      dsprId,
      imageFile
    )
  ).then((response) => {
    if (response.type === 'UPDATE_DSPR_SUCCESS') {
      return dispatch(getDSPR(dsprId));
    } else {
      return response;
    }
  });
};
export const GET_DSPR = 'GET_DSPR';
export const GET_DSPR_SUCCESS = 'GET_DSPR_SUCCESS';
export const GET_DSPR_FAILURE = 'GET_DSPR_FAILURE';

const dspr = (dsprId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [GET_DSPR, GET_DSPR_SUCCESS, GET_DSPR_FAILURE],
      endPoint: `dspr/${dsprId}`,
      schema: Schemas.DSPR,
    },
  };
};

export const getDSPR = (dsprId) => (dispatch) => {
  return dispatch(dspr(dsprId));
};

export const ADD_DSPR_AWAY_MESSAGE = 'ADD_DSPR_AWAY_MESSAGE';
export const ADD_DSPR_AWAY_MESSAGE_SUCCESS = 'ADD_DSPR_AWAY_MESSAGE_SUCCESS';
export const ADD_DSPR_AWAY_MESSAGE_FAILURE = 'ADD_DSPR_AWAY_MESSAGE_FAILURE';

const dsprAwayMessageAdder = (awayMessage: string, dsprId: number) => {
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ADD_DSPR_AWAY_MESSAGE,
        ADD_DSPR_AWAY_MESSAGE_SUCCESS,
        ADD_DSPR_AWAY_MESSAGE_SUCCESS,
      ],
      endPoint: 'dspr/away-message',
      body: {
        message: awayMessage,
        dspr: { id: dsprId },
      },
      schema: Schemas.DSPR,
    },
  };
};

export const addDsprAwayMessage = (awayMessage: string, dsprId: number) => (
  dispatch
) => {
  return dispatch(dsprAwayMessageAdder(awayMessage, dsprId));
};

export const ASSIGN_DSPR_MANAGER = 'ASSIGN_DSPR_MANAGER';
export const ASSIGN_DSPR_MANAGER_SUCCESS = 'ASSIGN_DSPR_MANAGER_SUCCESS';
export const ASSIGN_DSPR_MANAGER_FAILURE = 'ASSIGN_DSPR_MANAGER_FAILURE';

const dsprManagerAssigner = (dsprId, managerUserId) => {
  const dsprManager = {
    dspr: {
      id: dsprId,
    },
    user: {
      id: managerUserId,
    },
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ASSIGN_DSPR_MANAGER,
        ASSIGN_DSPR_MANAGER_SUCCESS,
        ASSIGN_DSPR_MANAGER_FAILURE,
      ],
      endPoint: 'dspr/manager',
      schema: Schemas.DSPR_MANAGER,
      body: dsprManager,
    },
  };
};

export const assignDSPRManager = (dsprId, managerUserId) => (
  dispatch,
  getState
) => {
  return dispatch(dsprManagerAssigner(dsprId, managerUserId))
    .then(() => dispatch(getDSPR(dsprId)))
    .then(() => dispatch(getSpecificUser(managerUserId)));
};

export const TOGGLE_DSPR_MANAGER_ACTIVE_STATUS =
  'TOGGLE_DSPR_MANAGER_ACTIVE_STATUS';
export const TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS =
  'TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS';
export const TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_FAILURE =
  'TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_FAILURE';

const dsprManagerActiveStatusToggler = (dsprManagerId, isCurrentlyActive) => {
  const dsprManager = {
    id: dsprManagerId,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        TOGGLE_DSPR_MANAGER_ACTIVE_STATUS,
        TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_SUCCESS,
        TOGGLE_DSPR_MANAGER_ACTIVE_STATUS_FAILURE,
      ],
      endPoint: isCurrentlyActive
        ? 'dspr/manager/deactivate'
        : 'dspr/manager/activate',
      schema: Schemas.DSPR_MANAGER,
      body: dsprManager,
    },
  };
};

export const toggleDSPRManagerActiveStatus = (dsprManagerId) => (
  dispatch,
  getState
) => {
  return dispatch(
    dsprManagerActiveStatusToggler(
      dsprManagerId,
      getState().api.entities.dsprManagers[dsprManagerId].active
    )
  );
};

export const TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS =
  'TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS';
export const TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS =
  'TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS';
export const TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_FAILURE =
  'TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_FAILURE';

const dsprManagerOrderNotificationStatusChangeToggler = (dsprManagerId) => {
  const dsprManager = {
    id: dsprManagerId,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS,
        TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_SUCCESS,
        TOGGLE_DSPR_MANAGER_ORDER_NOTIFICATION_STATUS_FAILURE,
      ],
      endPoint: 'dspr/manager/toggle-notify-on-order-status-change',
      schema: Schemas.DSPR_MANAGER,
      body: dsprManager,
    },
  };
};

export const toggleDSPRManagerOrderNotificationStatus = (dsprManagerId) => (
  dispatch,
  getState
) => {
  return dispatch(
    dsprManagerOrderNotificationStatusChangeToggler(dsprManagerId)
  );
};

export const GET_ALL_ON_CALL_DRIVERS_FOR_DSPR =
  'GET_ALL_ON_CALL_DRIVERS_FOR_DSPR';
export const GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS =
  'GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS';
export const GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_FAILURE =
  'GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_FAILURE';

const onCallDriversGetter = (dsprId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ALL_ON_CALL_DRIVERS_FOR_DSPR,
        GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_SUCCESS,
        GET_ALL_ON_CALL_DRIVERS_FOR_DSPR_FAILURE,
      ],
      endPoint: 'dspr/driver/oncall',
      schema: Schemas.DSPR_MANAGER,
      queryParamsMap: { dspr_id: dsprId },
    },
  };
};

export const getOnCallDriversForDSPR = (dsprId) => (dispatch, getState) => {
  return dispatch(onCallDriversGetter(dsprId));
};

export const GET_ALL_DSPRS_FOR_DSP = 'GET_ALL_DSPRS_FOR_DSP';
export const GET_ALL_DSPRS_FOR_DSP_SUCCESS = 'GET_ALL_DSPRS_FOR_DSP_SUCCESS';
export const GET_ALL_DSPRS_FOR_DSP_FAILURE = 'GET_ALL_DSPRS_FOR_DSP_FAILURE';

const allDSPRsForDSPGetter = (dspId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ALL_DSPRS_FOR_DSP,
        GET_ALL_DSPRS_FOR_DSP_SUCCESS,
        GET_ALL_DSPRS_FOR_DSP_FAILURE,
      ],
      endPoint: 'dspr',
      schema: Schemas.DSPR_ARRAY,
      queryParamsMap: { delivery_service_provider_id: dspId },
    },
  };
};

export const getAllDSPRsForDSP = (dspId) => (dispatch, getState) => {
  return dispatch(allDSPRsForDSPGetter(dspId));
};

export const currentDriverInventoryCSVDownloadLink = (dsprDriverId) =>
  API_ROOT +
  `dspr/driver/download-csv?dspr_driver_id=${dsprDriverId}&access_token=${localStorage.getItem(
    LOCAL_STORAGE_ACCESS_TOKEN_KEY
  )}`;

export const currentDSPRInventorySnapshotCSVDownloadLink = (dsprId) =>
  API_ROOT +
  `dspr/inventory/download-csv?dspr_id=${dsprId}&access_token=${localStorage.getItem(
    LOCAL_STORAGE_ACCESS_TOKEN_KEY
  )}`;

export const currentDSPROrderHistoryCSVDownloadLink = (
  dsprId,
  beginDay,
  endDay,
  orderStatus
) => {
  const orderStatusString = orderStatus ? `&orderStatus=${orderStatus}` : '';
  return (
    API_ROOT +
    `order/history/dspr/download-csv?dspr_id=${dsprId}&begin_day_timestamp=${beginDay}&end_day_timestamp=${endDay}${orderStatusString}&access_token=${localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_KEY
    )}`
  );
};

export const GET_ORDER_HISTORY_FOR_DSPR = 'GET_ORDER_HISTORY_FOR_DSPR';
export const GET_ORDER_HISTORY_FOR_DSPR_SUCCESS =
  'GET_ORDER_HISTORY_FOR_DSPR_SUCCESS';
export const GET_ORDER_HISTORY_FOR_DSPR_FAILURE =
  'GET_ORDER_HISTORY_FOR_DSPR_FAILURE';

const dsprOrderHistoryGetter = (
  dsprId,
  beginDayTimestamp,
  endDayTimestamp,
  orderStatus
) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ORDER_HISTORY_FOR_DSPR,
        GET_ORDER_HISTORY_FOR_DSPR_SUCCESS,
        GET_ORDER_HISTORY_FOR_DSPR_FAILURE,
      ],
      endPoint: 'order/history/dspr',
      schema: Schemas.DSPR_ORDER_HISTORY,
      queryParamsMap: {
        dspr_id: dsprId,
        begin_day_timestamp: beginDayTimestamp,
        end_day_timestamp: endDayTimestamp,
        order_status: orderStatus,
      },
    },
  };
};

export const getDSPROrderHistory = (
  dsprId,
  beginDayTimestamp,
  endDayTimestamp,
  orderStatus
) => (dispatch, getState) => {
  return dispatch(
    dsprOrderHistoryGetter(
      dsprId,
      beginDayTimestamp,
      endDayTimestamp,
      orderStatus
    )
  );
};

export const GET_ANALYTICS_FOR_DSPR = 'GET_ANALYTICS_FOR_DSPR';
export const GET_ANALYTICS_FOR_DSPR_SUCCESS = 'GET_ANALYTICS_FOR_DSPR_SUCCESS';
export const GET_ANALYTICS_FOR_DSPR_FAILURE = 'GET_ANALYTICS_FOR_DSPR_FAILURE';

const dsprAnalyticsGetter = (dsprId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ANALYTICS_FOR_DSPR,
        GET_ANALYTICS_FOR_DSPR_SUCCESS,
        GET_ANALYTICS_FOR_DSPR_FAILURE,
      ],
      endPoint: `dspr/analytics/${dsprId}`,
      schema: Schemas.DSPR,
    },
  };
};

export const getDSPRAnalytics = (dsprId) => (dispatch, getState) => {
  return dispatch(dsprAnalyticsGetter(dsprId));
};

export const REBUILD_ANALYTICS_FOR_DSPR = 'REBUILD_ANALYTICS_FOR_DSPR';
export const REBUILD_ANALYTICS_FOR_DSPR_SUCCESS =
  'REBUILD_ANALYTICS_FOR_DSPR_SUCCESS';
export const REBUILD_ANALYTICS_FOR_DSPR_FAILURE =
  'REBUILD_ANALYTICS_FOR_DSPR_FAILURE';

const dsprAnalyticsRebuilder = (dsprId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        REBUILD_ANALYTICS_FOR_DSPR,
        REBUILD_ANALYTICS_FOR_DSPR_SUCCESS,
        REBUILD_ANALYTICS_FOR_DSPR_FAILURE,
      ],
      endPoint: `dspr/analytics/rebuild/${dsprId}`,
      schema: Schemas.DSPR,
    },
  };
};

export const rebuildDSPRAnalytics = (dsprId) => (dispatch, getState) => {
  return dispatch(dsprAnalyticsRebuilder(dsprId));
};

export const CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY =
  'CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY';
export const CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS =
  'CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS';
export const CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_FAILURE =
  'CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_FAILURE';

const createPromotionForProductCategory = (
  dsprId: number,
  productCategoryId: number,
  promotionalText: string,
  imageFile: any
) => {
  const dsprPromotion = {
    dspr: { id: dsprId },
    productCategory: { id: productCategoryId },
    promotionalText: promotionalText,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY,
        CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_SUCCESS,
        CREATE_DSPR_PROMOTION_FOR_PRODUCT_CATEGORY_FAILURE,
      ],
      endPoint: 'dspr/product-category-promotions',
      schema: Schemas.DSPR_PRODUCT_CATEGORY_PROMOTION_ARRAY,
      body: dsprPromotion,
      file: imageFile,
    },
  };
};

export const createDsprPromotionForProductCategory = (
  dsprId: number,
  productCategoryId: number,
  promotionalText: string,
  imageFile: any
) => (dispatch) => {
  return dispatch(
    createPromotionForProductCategory(
      dsprId,
      productCategoryId,
      promotionalText,
      imageFile
    )
  );
};

export const GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES =
  'GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES';
export const GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS =
  'GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS';
export const GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_FAILURE =
  'GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_FAILURE';

const getPromotionsForProductCategories = (dsprId: number) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES,
        GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_SUCCESS,
        GET_DSPR_PROMOTION_FOR_PRODUCT_CATEGORIES_FAILURE,
      ],
      endPoint: `dspr/product-category-promotions/${dsprId}`,
      schema: Schemas.DSPR_PRODUCT_CATEGORY_PROMOTION_ARRAY,
    },
  };
};

export const getActiveDsprPromotionsForProductCategories = (dsprId: number) => (
  dispatch
) => {
  return dispatch(getPromotionsForProductCategories(dsprId));
};

export const HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION =
  'HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION';
export const HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS =
  'HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS';
export const HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_FAILURE =
  'HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_FAILURE';

const hidePromotionForDspr = (productCategoryId: number) => {
  const body = { id: productCategoryId };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION,
        HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_SUCCESS,
        HIDE_DSPR_PRODUCT_CATEGORY_PROMOTION_FAILURE,
      ],
      endPoint: `dspr/product-category-promotions/hide`,
      schema: Schemas.DSPR_PRODUCT_CATEGORY_PROMOTION,
      body,
    },
  };
};

export const hideActiveDsprPromotionForProductCategory = (
  productCategoryId: number
) => (dispatch) => {
  return dispatch(hidePromotionForDspr(productCategoryId));
};

export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA =
  'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA';
export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS =
  'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS';
export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE =
  'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE';

const createOrUpdateADsprServiceArea = (dsprDriverServiceArea) => {
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA,
        CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS,
        CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE,
      ],
      endPoint: `dspr/driver-service-area`,
      schema: Schemas.DSPR_DRIVER_SERVICE_AREA,
      body: dsprDriverServiceArea,
    },
  };
};

export const createOrUpdateDsprServiceArea = (dsprDriverServiceArea) => (
  dispatch
) => {
  return dispatch(createOrUpdateADsprServiceArea(dsprDriverServiceArea));
};

export const GET_DSPR_DRIVER_SERVICE_AREAS = 'GET_DSPR_DRIVER_SERVICE_AREAS';
export const GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS =
  'GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS';
export const GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE =
  'GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE';

const getDsprDriverServiceAreas = (dsprId: string) => {
  const queryParamsMap = {
    dspr_id: dsprId,
  };
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_DSPR_DRIVER_SERVICE_AREAS,
        GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS,
        GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE,
      ],
      endPoint: `dspr/driver-service-area`,
      schema: Schemas.DSPR_DRIVER_SERVICE_AREA_ARRAY,
      queryParamsMap,
    },
  };
};

export const getAllDsprDriverServiceAreasForDspr = (dsprId: string) => (
  dispatch
) => {
  return dispatch(getDsprDriverServiceAreas(dsprId));
};

export const UPDATE_DSPR_MENU_MECHANISM = 'UPDATE_DSPR_MENU_MECHANISM';
export const UPDATE_DSPR_MENU_MECHANISM_SUCCESS =
  'UPDATE_DSPR_MENU_MECHANISM_SUCCESS';
export const UPDATE_DSPR_MENU_MECHANISM_FAILURE =
  'UPDATE_DSPR_MENU_MECHANISM_FAILURE';

const dsprMenuMechanismUpdate = (dsprId: number, menuMechanism: string) => {
  const dsprUpdate = {
    id: dsprId,
    menuMechanism,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        UPDATE_DSPR_MENU_MECHANISM,
        UPDATE_DSPR_MENU_MECHANISM_SUCCESS,
        UPDATE_DSPR_MENU_MECHANISM_FAILURE,
      ],
      endPoint: 'dspr/update',
      schema: Schemas.DSPR,
      body: dsprUpdate,
    },
  };
};

export const updateDSPRMenuMechanism = (
  dsprId: number,
  menuMechanism: string
) => (dispatch) => {
  return dispatch(dsprMenuMechanismUpdate(dsprId, menuMechanism)).then(
    (response) => {
      if (response.type === UPDATE_DSPR_MENU_MECHANISM_SUCCESS) {
        return dispatch(getDSPR(dsprId));
      } else {
        return response;
      }
    }
  );
};
