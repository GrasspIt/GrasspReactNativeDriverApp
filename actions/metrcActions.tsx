import { CALL_API, Schemas } from "../middleware/api";
import { Alert } from "react-native";

export const METRC_TAG_SUBMIT_PENDING = 'METRC_TAG_SUBMIT_PENDING';
export const METRC_TAG_SUBMIT = 'METRC_TAG_SUBMIT';
export const METRC_TAG_SUBMIT_SUCCESS = 'METRC_TAG_SUBMIT_SUCCESS';
export const METRC_TAG_SUBMIT_FAILURE = 'METRC_TAG_SUBMIT_FAILURE';

const metrcTagSubmitter = (metrcTag: string, orderId: number, productId: number, orderDetailId: number) => {
    return {
        [CALL_API]: {
            httpAction: 'POST',
            types: [METRC_TAG_SUBMIT, METRC_TAG_SUBMIT_SUCCESS, METRC_TAG_SUBMIT_FAILURE],
            endPoint: 'metrc/scan_barcode',
            body: {
                metrcTag,
                orderId,
                productId,
                orderDetailId
            },
            schema: Schemas.METRC_TAG,
        },
    }
}

export const submitMetrcTag = (metrcTag: string, orderId: number, productId: number, orderDetailId: number) => (dispatch) => {
    dispatch({type: METRC_TAG_SUBMIT_PENDING});
    return dispatch(metrcTagSubmitter(metrcTag, orderId, productId, orderDetailId))
        .then((response) => {
            //IMPORTANT: errors are handled in the screens and components that dispatch this action
            return {type: response.type, error: response.error};
        })
        .catch((error) => Alert.alert('Network error:', error));
}

export const RESET_METRC_ORDER_SCANS = 'RESET_METRC_ORDER_SCANS';
export const RESET_METRC_ORDER_SCANS_SUCCESS = 'RESET_METRC_ORDER_SCANS_SUCCESS';
export const RESET_METRC_ORDER_SCANS_FAILURE = 'RESET_METRC_ORDER_SCANS_FAILURE';

export const RESET_METRC_ORDER_DETAIL_SCANS = 'RESET_METRC_ORDER_DETAIL_SCANS';
export const RESET_METRC_ORDER_DETAIL_SCANS_SUCCESS = 'RESET_METRC_ORDER_DETAIL_SCANS_SUCCESS';
export const RESET_METRC_ORDER_DETAIL_SCANS_FAILURE = 'RESET_METRC_ORDER_DETAIL_SCANS_FAILURE';