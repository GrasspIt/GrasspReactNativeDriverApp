import { CALL_API, Schemas } from "../middleware/api";
import { Alert } from "react-native";

export const ORDER_SCAN_SUBMIT_PENDING = 'ORDER_SCAN_SUBMIT_PENDING';
export const ORDER_SCAN_SUBMIT = 'ORDER_SCAN_SUBMIT';
export const ORDER_SCAN_SUBMIT_SUCCESS = 'ORDER_SCAN_SUBMIT_SUCCESS';
export const ORDER_SCAN_SUBMIT_FAILURE = 'ORDER_SCAN_SUBMIT_FAILURE';

const barcodeScanSubmitter = (metrcTag: string, orderId: number, productId: number, orderDetailId: number) => {
    return {
        [CALL_API]: {
            httpAction: 'POST',
            types: [ORDER_SCAN_SUBMIT, ORDER_SCAN_SUBMIT_SUCCESS, ORDER_SCAN_SUBMIT_FAILURE],
            endPoint: 'scan/barcode',
            body: {
                metrcTag,
                orderId,
                productId,
                orderDetailId
            },
            schema: Schemas.ORDER_SCAN,
        },
    }
}

export const submitBarcodeScan = (metrcTag: string, orderId: number, productId: number, orderDetailId: number) => (dispatch) => {
    dispatch({type: ORDER_SCAN_SUBMIT_PENDING});
    return dispatch(barcodeScanSubmitter(metrcTag, orderId, productId, orderDetailId))
        .then((response) => {
            //errors are handled in the screens and components that dispatch this action
            return {type: response.type, error: response.error};
        })
        .catch((error) => Alert.alert('Network error:', error));
}

export const GET_CURRENT_ORDER_SCANS_FOR_ORDER_PENDING = 'GET_CURRENT_ORDER_SCANS_FOR_ORDER_PENDING';
export const GET_CURRENT_ORDER_SCANS_FOR_ORDER = 'GET_CURRENT_ORDER_SCANS_FOR_ORDER';
export const GET_CURRENT_ORDER_SCANS_FOR_ORDER_SUCCESS = 'GET_CURRENT_ORDER_SCANS_FOR_ORDER_SUCCESS';
export const GET_CURRENT_ORDER_SCANS_FOR_ORDER_FAILURE = 'GET_CURRENT_ORDER_SCANS_FOR_ORDER_FAILURE';

const alreadyScannedForOrderGetter = (orderId: number) => (dispatch) => {
    return {
        [CALL_API]: {
            httpAction: 'GET',
            types: [ORDER_SCAN_SUBMIT, ORDER_SCAN_SUBMIT_SUCCESS, ORDER_SCAN_SUBMIT_FAILURE],
            endPoint: 'scan/already_scanned',
            schema: Schemas.ORDER_SCAN_ARRAY,
            queryParamsMap: {orderId}
        },
    }
}

/**Fetch an array of Order Scan objects for previously scanned items in an order*/
const getAlreadyScannedForOrder = (orderId: number) => (dispatch) => {
    return dispatch(alreadyScannedForOrderGetter(orderId));
}

export const RESET_ORDER_SCANS_PENDING = 'RESET_ORDER_SCANS_PENDING';
export const RESET_ORDER_SCANS = 'RESET_ORDER_SCANS';
export const RESET_ORDER_SCANS_SUCCESS = 'RESET_ORDER_SCANS_SUCCESS';
export const RESET_ORDER_SCANS_FAILURE = 'RESET_ORDER_SCANS_FAILURE';

const orderScansDeactivator = (orderId: number) => (dispatch) => {
    return {
        [CALL_API]: {
            httpAction: 'POST',
            types: [RESET_ORDER_SCANS, RESET_ORDER_SCANS_SUCCESS, RESET_ORDER_SCANS_FAILURE],
            endPoint: 'scan/unscan/order',
            body: {
                orderId
            },
            schema: Schemas.EMPTY,
        },
    }
}

export const deactivateOrderScans = (orderId: number) => (dispatch) => {
    dispatch({type: RESET_ORDER_SCANS_PENDING});
    dispatch(orderScansDeactivator(orderId))
        .then(response => {
            if (response.type === RESET_ORDER_SCANS_SUCCESS) {
                dispatch(getAlreadyScannedForOrder(orderId));
            }

            if (response.type === RESET_ORDER_SCANS_FAILURE) {
                Alert.alert('Failed to cancel order:', response.error);
            }
        })
        .catch((error) => Alert.alert('Network error:', error));

}

export const RESET_ORDER_DETAIL_SCANS = 'RESET_ORDER_DETAIL_SCANS';
export const RESET_ORDER_DETAIL_SCANS_SUCCESS = 'RESET_ORDER_DETAIL_SCANS_SUCCESS';
export const RESET_ORDER_DETAIL_SCANS_FAILURE = 'RESET_ORDER_DETAIL_SCANS_FAILURE';