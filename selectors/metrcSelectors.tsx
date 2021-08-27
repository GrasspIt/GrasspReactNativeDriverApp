import { MetrcTag, State } from '../store/reduxStoreState';
import { createSelector } from 'reselect';

export const getMetrcScansForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): MetrcTag[] => {
    const metrcScansForOrderDetail = state.api.entities.metrcTagsForOrder[orderId] && state.api.entities.metrcTagsForOrder[orderId][orderDetailId]
    return metrcScansForOrderDetail ? metrcScansForOrderDetail : [];
}

export const getMetrcScanCountForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): number => {
    const metrcScansForOrderDetail = getMetrcScansForOrderDetailFromProps(state, {orderId, orderDetailId});
    return metrcScansForOrderDetail.length
}

export const getMetrcScansForOrderFromProps = (state: State, {orderId}): { [orderId: number]: MetrcTag[]} => {
    const metrcScansForOrder = state.api.entities.metrcTagsForOrder[orderId]
    return metrcScansForOrder ? metrcScansForOrder : {};
}

export const getMetrcScanCountForOrderFromProps = (state: State, {orderId}): number => {
    console.log('getMetrcScanCountForOrderFromProps Running!!!')
    const metrcScansForOrder = getMetrcScansForOrderFromProps(state, {orderId});

    return Object.values(metrcScansForOrder).reduce(((acc, currVal) => acc + currVal.length), 0)
    //let scanCount = 0;
    //
    //if (metrcScansForOrder && Object.keys(metrcScansForOrder).length > 0) {
    //    for (let orderDetailId in metrcScansForOrder) {
    //        scanCount += metrcScansForOrder[orderDetailId].length;
    //    }
    //}
    //return scanCount;
}