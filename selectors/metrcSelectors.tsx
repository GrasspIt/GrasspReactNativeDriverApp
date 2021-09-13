import { OrderScan, State } from '../store/reduxStoreState';
import { createSelector } from 'reselect';
import { getProductsForDSP } from "./dspProductSelector";
import { getOrderFromProps } from "./orderSelectors";

//export const getProductsForDSPForAutoSelect = createSelector([getProductsForDSP], (products) => {
//    return products
//        ? products.map((product) => {
//            return { value: product.id, text: product.name };
//        })
//        : [];
//});

export const getOrderScans = (state: State): {[orderScanId: number]: OrderScan} => {
    return state.api.entities.orderScans;
}

/**Returns an array of OrderScan objects for a particular order detail*/
export const getOrderScansForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): OrderScan[] => {
    const metrcScansForOrderDetail = state.api.entities.orderScans[orderId] && state.api.entities.metrcTagsForOrder[orderId][orderDetailId]
    return metrcScansForOrderDetail ? metrcScansForOrderDetail : [];
}

/**Returns count of scans for a particular order detail*/
export const getOrderScanCountForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): number => {
    const metrcScansForOrderDetail = getOrderScansForOrderDetailFromProps(state, {orderId, orderDetailId});
    return metrcScansForOrderDetail.length
}

const getOrderScanIdsForOrderFromProps = (state: State, {orderId}): number[] => {
    const order = getOrderFromProps(state, {orderId});
    return order && order.metrcOrderDetailAssociationScans ? order.metrcOrderDetailAssociationScans : [];
}

/**Returns an object of orderDetailIds and OrderScan objects {[orderDetailId]: [OrderScan]}*/
export const getOrderScansForOrderFromProps = (state: State, {orderId}): { [orderDetailId: number]: OrderScan[] } => {
    const orderScanIds = getOrderScanIdsForOrderFromProps(state, {orderId});
    const allOrderScans = getOrderScans(state);

    if (orderScanIds.length > 0 && orderScanIds.length > 0) {
        const scansForOrder = {};
        orderScanIds.forEach(scanId => {
            const orderScan = allOrderScans[scanId];
            const orderDetailId = orderScan.orderDetail;
            scansForOrder[orderDetailId]
                ? scansForOrder[orderDetailId] = scansForOrder[orderDetailId].push(orderScan)
                : [orderScan];
        })

        return scansForOrder;
    }

    return {};
}

/**Returns count of scans for an order*/
export const getMetrcScanCountForOrderFromProps = (state: State, {orderId}): number => {
    console.log('getMetrcScanCountForOrderFromProps Running!!!')
    const metrcScansForOrder = getOrderScansForOrderFromProps(state, {orderId});

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