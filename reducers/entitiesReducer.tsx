import * as _ from 'lodash';
import { LOGGED_IN_USER_INFO_SUCCESS } from '../actions/oauthActions';
import {
    GET_SPECIFIC_USER_SUCCESS,
    GET_USER_ID_DOCUMENT_SUCCESS,
    GET_USER_MEDICAL_RECOMMENDATION_SUCCESS,
    CREATE_USER_NOTE_SUCCESS,
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
    COMPLETE_ORDER_SUCCESS,
    CANCEL_ORDER_SUCCESS,
    GET_ORDER_DETAILS_WITH_ID_SUCCESS,
} from '../actions/orderActions';
import {
    RESET_ORDER_DETAIL_SCANS_SUCCESS,
    RESET_ORDER_SCANS_SUCCESS,
    ORDER_SCAN_SUBMIT_SUCCESS, GET_CURRENT_ORDER_SCANS_FOR_ORDER_SUCCESS
} from "../actions/scanActions";
import { OrderScan } from "../store/reduxStoreState";

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
    dspProducts: {},
    orderScans: {},
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
        case GET_USER_ID_DOCUMENT_SUCCESS:
        case GET_USER_MEDICAL_RECOMMENDATION_SUCCESS:
        case CANCEL_ORDER_SUCCESS:
        case CREATE_USER_NOTE_SUCCESS:
        case HIDE_USER_NOTE_SUCCESS:
        case UNHIDE_USER_NOTE_SUCCESS:
        case HIDE_USER_DOCUMENT_SUCCESS:
        case UNHIDE_USER_DOCUMENT_SUCCESS:
        case SEND_PUSH_TOKEN_SUCCESS:
        case COMPLETE_ORDER_SUCCESS:
            return appendAndUpdateEntitiesFromResponse(state, responseEntities);
        case GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS:
        case CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS:
        case PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS:
        case CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS:
        case CREATE_NEW_DSPR_DRIVER_ROUTE_WITHOUT_NOTIFICATIONS_SUCCESS:
        case DEACTIVATE_DSPR_DRIVER_ROUTE_SUCCESS:
        case GET_ORDER_DETAILS_WITH_ID_SUCCESS:
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
            state = {...state, dsprDrivers: oldDsprDrivers, dsprDriverRoutes: oldRoutes};
            return appendAndUpdateEntitiesFromResponseWithArrayOverwrite(state, responseEntities);
        case ORDER_SCAN_SUBMIT_SUCCESS:
            if (responseEntities) {
                const modifiedState = {...state};
                const barcodeId = action.response.result;
                const orderId = responseEntities.orderScans[barcodeId].order;

                //Update scannedProductOrderDetailAssociationScans in order object
                const orderProductAssociations = modifiedState.orders[orderId].scannedProductOrderDetailAssociationsScans;
                modifiedState.orders[orderId].scannedProductOrderDetailAssociationsScans = orderProductAssociations ? [...orderProductAssociations, barcodeId] : [barcodeId];

                return appendAndUpdateEntitiesFromResponse(modifiedState, responseEntities);
            }
            return state;
        case GET_CURRENT_ORDER_SCANS_FOR_ORDER_SUCCESS:
            if (responseEntities && Object.keys(responseEntities).length > 0) {
                const modifiedState = {...state};
                const orderId = Object.keys(responseEntities.orders)[0]
                modifiedState.orders[orderId].scannedProductOrderDetailAssociationsScans = action.response.result;
                return appendAndUpdateEntitiesFromResponse(modifiedState, responseEntities);
            }
            return state;
        case RESET_ORDER_DETAIL_SCANS_SUCCESS:
            if (responseEntities) {
                const modifiedState = {...state};
                const orderDetailId = action.response.result;
                const scansForOrderDetail:OrderScan[] = Object.values<OrderScan>(modifiedState.orderScans).filter(orderScan => orderScan.orderDetail === orderDetailId);

                //Order detail had no scans -> return state
                if (scansForOrderDetail.length === 0) return {...state};

                const scanIDsForOrderDetail: number[] = scansForOrderDetail.map(scan => scan.id);

                const orderId = scansForOrderDetail[0].order;
                const orderToUpdate = modifiedState.orders[orderId]

                //remove scanIds from order.scannedProductOrderDetailAssociationsScans that belong to the unscanned order detail
                orderToUpdate.scannedProductOrderDetailAssociationsScans = orderToUpdate.scannedProductOrderDetailAssociationsScans.filter(scanId => !scanIDsForOrderDetail.includes(scanId));

                //remove scanId properties from orderScans
                scanIDsForOrderDetail.forEach(scanId => delete modifiedState.orderScans[scanId]);
                return modifiedState;
            }
            return state;
        case RESET_ORDER_SCANS_SUCCESS:
            if (responseEntities) {
                const modifiedState = {...state};
                const orderId = action.response.result;
                const orderScanIdsToDelete = modifiedState.orders[orderId].scannedProductOrderDetailAssociationsScans;

                //delete orderScan objects in orderScans
                if (orderScanIdsToDelete) {
                    orderScanIdsToDelete.forEach(scanId => {
                        delete modifiedState.orderScans[scanId];
                    })
                }

                //replace scannedProductOrderDetailAssociationsScans for order with empty array
                modifiedState.orders[orderId].scannedProductOrderDetailAssociationsScans = [];
                return modifiedState;
            }
            return state;

        default:
            return state;
    }
};
