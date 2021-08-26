import { MetrcTag, State } from '../store/reduxStoreState';
import { createSelector } from 'reselect';

export const getMetrcScansForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): MetrcTag[] => {
    return state.api.entities.metrcTagsForOrder[orderId] && state.api.entities.metrcTagsForOrder[orderId][orderDetailId]
        ? state.api.entities.metrcTagsForOrder[orderId][orderDetailId]
        : [];
}

export const getMetrcScanCountForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): number => {
    const metrcScansForOrderDetail = getMetrcScansForOrderDetailFromProps(state, {orderId, orderDetailId});
    return metrcScansForOrderDetail.length
}

export const getMetrcScansForOrderFromProps = (state: State, {orderId}): { [orderId: number]: MetrcTag[]} => {
    return state.api.entities.metrcTagsForOrder[orderId]
}

export const getMetrcScanCountForOrderFromProps = (state: State, {orderId}): number => {
    const metrcScansForOrder = getMetrcScansForOrderFromProps(state, {orderId});
    let scanCount = 0;

    if (Object.keys(metrcScansForOrder).length > 0) {
        for (let orderDetailId in metrcScansForOrder) {
            scanCount += metrcScansForOrder[orderDetailId].length;
        }
    }
    return scanCount;
}