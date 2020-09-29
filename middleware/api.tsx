import { schema, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import qs from 'query-string';
import * as SecureStore from 'expo-secure-store';
// import { logException } from '../actions/apiUIHelperActions';
import { logout } from '../actions/oauthActions';
import { getEnvVars } from '../environment';
const { apiUrl } = getEnvVars();

export const API_HOST = apiUrl;

export const API_ROOT = API_HOST + 'v1/';

const accessTokenKey = SecureStore.getItemAsync('accessToken');

export const getUserDocumentUrl = (document, userId) =>
  API_ROOT + `user/${document}/document/${userId}?access_token=${accessTokenKey}`;

export const getDocumentImage = (document, filename: string) =>
  API_ROOT + `user/${document}/documentfile/${btoa(filename)}?access_token=${accessTokenKey}`;

export const getImage = (filename: string) =>
  API_HOST + `${filename}?access_token=${accessTokenKey}`;

export const getTripTicketUrl = (orderId) =>
  API_ROOT + `order/trip-ticket-${orderId}.html?access_token=${accessTokenKey}`;

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (
  httpAction: string,
  endpoint: string,
  schema,
  accessToken,
  body: any = {},
  queryParamsMap: any = {},
  file
) => {
  queryParamsMap.access_token = accessToken;
  const queryParamsString = qs.stringify(queryParamsMap);
  const fullUrl =
    (endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint) + `?${queryParamsString}`;

  let fetchInit = {};

  if (httpAction !== 'GET') {
    const jsonBody = JSON.stringify(body);
    let formData;
    let headers;
    if (file) {
      formData = new FormData();
      formData.append('file', file);
      formData.append('meta-data', jsonBody);
      headers = new Headers();
    } else {
      headers = new Headers();
      headers.append('Content-Type', 'application/json');
    }
    fetchInit = {
      mode: 'cors',
      method: httpAction,
      headers,
      body: formData ? formData : jsonBody,
    };
  }

  return fetch(fullUrl, fetchInit).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        throw json;
      }
      return Object.assign({}, normalize(camelizeKeys(json), schema));
    })
  );
};

const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: (user) => user.id,
  }
);

const pushTokenSchema = new schema.Entity(
  'pushToken',
  {},
  {
    idAttribute: (token) => token.id,
  }
);

const searchUserSchema = new schema.Entity(
  'searchUsers',
  {},
  {
    idAttribute: (user) => user.id,
  }
);
const unverifiedUserSchema = new schema.Entity(
  'unverifiedUsers',
  {},
  {
    idAttribute: (user) => user.id,
  }
);

const dspSchema = new schema.Entity(
  'deliveryServiceProviders',
  {},
  {
    idAttribute: (deliveryServiceProvider) => deliveryServiceProvider.id,
  }
);

const dspManagerSchema = new schema.Entity(
  'dspManagers',
  {},
  {
    idAttribute: (dspManager) => dspManager.id,
  }
);

const dsprSchema = new schema.Entity(
  'DSPRs',
  {},
  {
    idAttribute: (dspr) => dspr.id,
  }
);

const dsprManagerSchema = new schema.Entity(
  'dsprManagers',
  {},
  {
    idAttribute: (dsprManager) => dsprManager.id,
  }
);

const dsprDriverSchema = new schema.Entity(
  'dsprDrivers',
  {},
  {
    idAttribute: (dsprDriver) => dsprDriver.id,
  }
);

const dspProductSchema = new schema.Entity(
  'dspProducts',
  {},
  {
    idAttribute: (dspProduct) => dspProduct.id,
  }
);

const searchProductSchema = new schema.Entity(
  'searchProducts',
  {},
  {
    idAttribute: (searchProduct) => searchProduct.id,
  }
);

const dspProductCategorySchema = new schema.Entity(
  'dspProductCategories',
  {},
  {
    idAttribute: (category) => category.id,
  }
);

const dsprDriverLocationSchema = new schema.Entity(
  'dsprDriverLocations',
  {},
  {
    idAttribute: (location) => location.id,
  }
);

const dsprDriverInventoryPeriodSchema = new schema.Entity(
  'dsprDriverInventoryPeriods',
  {},
  {
    idAttribute: (inventoryPeriod) => inventoryPeriod.id,
  }
);

const dsprZipCodeSchema = new schema.Entity(
  'dsprZipCodes',
  {},
  {
    idAttribute: (dsprZipCode) => dsprZipCode.id,
  }
);

const dsprDriverInventoryItemSchema = new schema.Entity(
  'dsprDriverInventoryItems',
  {},
  {
    idAttribute: (item) => item.id,
  }
);

const dsprProductInventoryTransactionSchema = new schema.Entity(
  'dsprProductInventoryTransactions',
  {},
  {
    idAttribute: (transaction) => transaction.id,
  }
);

const dsprCurrentInventoryItemSchema = new schema.Entity(
  'dsprCurrentInventoryItems',
  {},
  {
    idAttribute: (item) => item.id,
  }
);

const userIdDocumentSchema = new schema.Entity(
  'usersIdDocuments',
  {},
  {
    idAttribute: (document) => document.id,
  }
);

const userMedicalRecommendationSchema = new schema.Entity(
  'usersMedicalRecommendations',
  {},
  {
    idAttribute: (document) => document.id,
  }
);

const dsprProductPriceHistorySchema = new schema.Entity(
  'dsprProductPriceHistories',
  {},
  {
    idAttribute: (priceHistory) => priceHistory.id,
  }
);

const couponSchema = new schema.Entity(
  'coupons',
  {},
  {
    idAttribute: (coupon) => coupon.id,
  }
);

const orderSchema = new schema.Entity(
  'orders',
  {},
  {
    idAttribute: (order) => order.id,
  }
);

const addressSchema = new schema.Entity(
  'addresses',
  {},
  {
    idAttribute: (address) => address.id,
  }
);

const dsprOrderHistorySchema = new schema.Entity(
  'dsprOrderHistories',
  {},
  {
    idAttribute: (orderHistory) => orderHistory.dspr.id,
  }
);

const textBlastSchema = new schema.Entity(
  'textBlasts',
  {},
  {
    idAttribute: (textBlast) => textBlast.id,
  }
);

const userNoteSchema = new schema.Entity(
  'userNotes',
  {},
  {
    idAttribute: (userNote) => userNote.id,
  }
);

const dsprProductCategoryPromotionSchema = new schema.Entity(
  'dsprProductCategoryPromotions',
  {},
  {
    idAttribute: (productCategoryPromotion) => productCategoryPromotion.id,
  }
);

const metricSchema = new schema.Entity(
  'metrics',
  {},
  {
    idAttribute: (metric) => metric.metric,
  }
);

const dsprDriverServiceAreaSchema = new schema.Entity(
  'dsprDriverServiceAreas',
  {},
  {
    idAttribute: (dsprDriverServiceArea) => dsprDriverServiceArea.id,
  }
);

const dsprDriverServiceAreaVertexSchema = new schema.Entity(
  'dsprDriverServiceAreaVertices',
  {},
  {
    idAttribute: (vertex) => vertex.id,
  }
);

const dsprDriverRouteSchema = new schema.Entity(
  'dsprDriverRoutes',
  {},
  {
    idAttribute: (dsprDriverRoute) => dsprDriverRoute.id,
  }
);

const dsprDriverRouteLegSchema = new schema.Entity(
  'dsprDriverRouteLegs',
  {},
  {
    idAttribute: (dsprDriverRouteLeg) => dsprDriverRouteLeg.id,
  }
);

const dsprDriverRouteLegDirectionSchema = new schema.Entity(
  'dsprDriverRouteLegDirections',
  {},
  {
    idAttribute: (dsprDriverRouteLegDirection) => dsprDriverRouteLegDirection.id,
  }
);

const routeLocationSchema = new schema.Entity(
  'dsprDriverRouteLocations',
  {},
  {
    idAttribute: (routeLocation) => routeLocation.id,
  }
);

const routeMetricSchema = new schema.Entity(
  'dsprDriverRouteMetrics',
  {},
  {
    idAttribute: (routeMetric) => routeMetric.id,
  }
);

dsprDriverRouteSchema.define({
  dsprDriver: dsprDriverSchema,
  startLocation: routeLocationSchema,
  endLocation: routeLocationSchema,
  metrics: routeMetricSchema,
  initialDriverLocation: dsprDriverLocationSchema,
  finalOrder: orderSchema,
  legs: [dsprDriverRouteLegSchema],
  polylineContainingCoordinates: [routeLocationSchema],
});

dsprDriverRouteLegSchema.define({
  route: dsprDriverRouteSchema,
  startLocation: routeLocationSchema,
  endLocation: routeLocationSchema,
  metrics: routeMetricSchema,
  order: orderSchema,
  routeLegDirections: [dsprDriverRouteLegDirectionSchema],
});

dsprDriverRouteLegDirectionSchema.define({
  routeLeg: dsprDriverRouteLegSchema,
  startLocation: routeLocationSchema,
  endLocation: routeLocationSchema,
  metrics: routeMetricSchema,
});

pushTokenSchema.define({});

dsprDriverServiceAreaSchema.define({
  dsprDriverServiceAreaVertices: [dsprDriverServiceAreaVertexSchema],
  dspr: dsprSchema,
  currentDriver: dsprDriverSchema,
});

dsprDriverServiceAreaVertexSchema.define({
  dspr: dsprSchema,
  dsprDriverServiceArea: dsprDriverServiceAreaSchema,
});

dsprProductCategoryPromotionSchema.define({
  dspr: dsprSchema,
  productCategory: dspProductCategorySchema,
});

userNoteSchema.define({
  user: userSchema,
  dsprManager: dspManagerSchema,
  dsprDriver: dsprDriverSchema,
});

textBlastSchema.define({});

dsprOrderHistorySchema.define({
  orders: [orderSchema],
  dspr: dsprSchema,
});

orderSchema.define({
  address: addressSchema,
  dsprDriver: dsprDriverSchema,
  user: userSchema,
  userMedicalRecommendation: userMedicalRecommendationSchema,
  userIdentificationDocument: userIdDocumentSchema,
  dspr: dsprSchema,
});

couponSchema.define({
  dspr: dsprSchema,
  specificallyAllowedProducts: [dspProductSchema],
  specificallyAllowedProductCategories: [dspProductCategorySchema],
  specificallyAllowedUsers: [userSchema],
});

dsprProductPriceHistorySchema.define({
  dspr: dsprSchema,
  product: dspProductSchema,
  dsprManager: dsprManagerSchema,
});

userIdDocumentSchema.define({
  user: userSchema,
});

userMedicalRecommendationSchema.define({
  user: userSchema,
});

dsprCurrentInventoryItemSchema.define({
  dspr: dsprSchema,
  product: dspProductSchema,
});

dsprProductInventoryTransactionSchema.define({
  product: dspProductSchema,
  dspr: dsprSchema,
  dsprManager: dsprManagerSchema,
});

dsprDriverInventoryItemSchema.define({
  dspr: dsprSchema,
  driver: dsprDriverSchema,
  inventoryPeriod: dsprDriverInventoryPeriodSchema,
  product: dspProductSchema,
});

dsprDriverInventoryPeriodSchema.define({
  dspr: dsprSchema,
  driver: dsprDriverSchema,
  dsprDriverInventoryItems: [dsprDriverInventoryItemSchema],
});

dsprDriverLocationSchema.define({
  dspr: dsprSchema,
  dsprDriver: dsprDriverSchema,
});

dspProductCategorySchema.define({
  deliveryServiceProvider: dspProductCategorySchema,
});

dspProductSchema.define({
  deliveryServiceProvider: dspSchema,
  currentPrice: dsprProductPriceHistorySchema,
  productCategories: [dspProductCategorySchema],
});

dsprDriverSchema.define({
  dspr: dsprSchema,
  user: userSchema,
  currentLocation: dsprDriverLocationSchema,
  currentInventoryPeriod: dsprDriverInventoryPeriodSchema,
  currentInProcessOrder: orderSchema,
  queuedOrders: [orderSchema],
  serviceAreas: [dsprDriverServiceAreaSchema],
  currentRoute: dsprDriverRouteSchema,
});

dsprManagerSchema.define({
  dspr: dsprSchema,
  user: userSchema,
});

dsprZipCodeSchema.define({
  dspr: dsprSchema,
});

dsprSchema.define({
  deliveryServiceProvider: dspSchema,
  managers: [dsprManagerSchema],
  drivers: [dsprDriverSchema],
  zipCodes: [dsprZipCodeSchema],
  outstandingOrders: [orderSchema],
});

dspManagerSchema.define({
  managerUser: userSchema,
  deliveryServiceProvider: dspSchema,
});

dspSchema.define({
  managers: [dspManagerSchema],
  products: [dspProductSchema],
  productCategories: [dspProductCategorySchema],
});

userSchema.define({
  deliveryServiceProviderManagers: [dspManagerSchema],
  dsprManagers: [dsprManagerSchema],
  dsprDrivers: [dsprDriverSchema],
  identificationDocument: userIdDocumentSchema,
  medicalRecommendation: userMedicalRecommendationSchema,
  userNotes: [userNoteSchema],
});

// Schemas for Grassp API responses.
export const Schemas = {
  PUSH_TOKEN: pushTokenSchema,
  USER: userSchema,
  USER_ARRAY: [userSchema],
  UNVERIFIED_USER: unverifiedUserSchema,
  UNVERIFIED_USER_ARRAY: [unverifiedUserSchema],
  USER_SEARCH_ARRAY: [searchUserSchema],
  DELIVERY_SERVICE_PROVIDER: dspSchema,
  DSP_ARRAY: [dspSchema],
  DSP_MANAGER: dspManagerSchema,
  DSP_MANAGER_ARRAY: [dspManagerSchema],
  DSPR: dsprSchema,
  DSPR_ARRAY: [dsprSchema],
  DSPR_MANAGER: dsprManagerSchema,
  DSPR_MANAGER_ARRAY: [dsprManagerSchema],
  DSPR_DRIVER: dsprDriverSchema,
  DSPR_DRIVER_ARRAY: [dsprDriverSchema],
  DSP_PRODUCT: dspProductSchema,
  DSP_PRODUCT_ARRAY: [dspProductSchema],
  DSP_PRODUCT_SEARCH_ARRAY: [searchProductSchema],
  DSPR_DRIVER_LOCATION: dsprDriverLocationSchema,
  DSPR_DRIVER_LOCATION_ARRAY: [dsprDriverLocationSchema],
  DSPR_DRIVER_INVENTORY_PERIOD: dsprDriverInventoryPeriodSchema,
  DSPR_ZIPCODE: dsprZipCodeSchema,
  DSPR_ZIPCODE_ARRAY: [dsprZipCodeSchema],
  DSPR_DRIVER_INVENTORY_PERIOD_ARRAY: [dsprDriverInventoryPeriodSchema],
  DSPR_DRIVER_INVENTORY_ITEM: dsprDriverInventoryItemSchema,
  DSPR_DRIVER_INVENTORY_ITEM_ARRAY: [dsprDriverInventoryItemSchema],
  DSPR_PRODUCT_INVENTORY_TRANSACTION: dsprProductInventoryTransactionSchema,
  DSPR_PRODUCT_INVENTORY_TRANSACTION_ARRAY: [dsprProductInventoryTransactionSchema],
  DSPR_CURRENT_INVENTORY_ITEM: dsprCurrentInventoryItemSchema,
  DSPR_CURRENT_INVENTORY_ITEM_ARRAY: [dsprCurrentInventoryItemSchema],
  USER_ID_DOCUMENT: userIdDocumentSchema,
  USER_ID_DOCUMENT_ARRAY: [userIdDocumentSchema],
  USER_MEDICAL_RECOMMENDATION: userMedicalRecommendationSchema,
  USER_MEDICAL_RECOMMENDATION_ARRAY: [userMedicalRecommendationSchema],
  DSPR_PRODUCT_PRICE_HISTORY: dsprProductPriceHistorySchema,
  DSPR_PRODUCT_PRICE_HISTORY_ARRAY: [dsprProductPriceHistorySchema],
  DSP_PRODUCT_CATEGORY: dspProductCategorySchema,
  DSP_PRODUCT_CATEGORY_ARRAY: [dspProductCategorySchema],
  COUPON: couponSchema,
  COUPON_ARRAY: [couponSchema],
  ORDER: orderSchema,
  ORDER_ARRAY: [orderSchema],
  DSPR_ORDER_HISTORY: dsprOrderHistorySchema,
  TEXT_BLAST: textBlastSchema,
  TEX_BLAST_ARRAY: [textBlastSchema],
  USER_NOTE: userNoteSchema,
  USER_NOTE_ARRAY: [userNoteSchema],
  DSPR_PRODUCT_CATEGORY_PROMOTION: dsprProductCategoryPromotionSchema,
  DSPR_PRODUCT_CATEGORY_PROMOTION_ARRAY: [dsprProductCategoryPromotionSchema],
  METRIC: metricSchema,
  METRIC_ARRAY: [metricSchema],
  DSPR_DRIVER_SERVICE_AREA: dsprDriverServiceAreaSchema,
  DSPR_DRIVER_SERVICE_AREA_ARRAY: [dsprDriverServiceAreaSchema],
  DSPR_DRIVER_SERVICE_AREA_VERTEX: dsprDriverServiceAreaVertexSchema,
  DSPR_DRIVER_SERVICE_AREA_VERTEX_ARRAY: [dsprDriverServiceAreaVertexSchema],
  DSPR_DRIVER_ROUTE: dsprDriverRouteSchema,
  DSPR_DRIVER_ROUTE_ARRAY: [dsprDriverRouteSchema],
  DSPR_DRIVER_ROUTE_LEG: dsprDriverRouteLegSchema,
  DSPR_DRIVER_ROUTE_LEG_ARRAY: [dsprDriverRouteLegSchema],
  DSPR_DRIVER_ROUTE_LEG_DIRECTION: dsprDriverRouteLegDirectionSchema,
  DSPR_DRIVER_ROUTE_LEG_DIRECTION_ARRAY: [dsprDriverRouteLegDirectionSchema],
  EMPTY: [], // <-- newly added to satisfy TypeScript. Might cause errors, need to investigate
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endPoint } = callAPI;
  const { schema, types, httpAction, body, queryParamsMap, file } = callAPI;

  if (typeof endPoint === 'function') {
    endPoint = endPoint(store.getState());
  }

  if (typeof endPoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every((type) => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const accessToken = store.getState().api.accessToken;

  if (!accessToken || typeof accessToken !== 'string') {
    store.dispatch(logout());
    // history.push("/login");
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(httpAction, endPoint, schema, accessToken, body, queryParamsMap, file).then(
    (response) =>
      next(
        actionWith({
          response,
          type: successType,
        })
      ),
    (error) => {
      // const errorMessage = error.message ? error.message : error.error;
      // logException(errorMessage, {
      //     action: requestType,
      //     callApi: callAPI,
      //     state: store.getState()
      // });
      if (error.status === 401 || error.error === 'invalid_token') {
        store.dispatch(logout());
        // history.push("/login");
      } else {
        return next(
          actionWith({
            type: failureType,
            error: error.message || 'Something went terribly wrong :( ',
          })
        );
      }
    }
  );
};
