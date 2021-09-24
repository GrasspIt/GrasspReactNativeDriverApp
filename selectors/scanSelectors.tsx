import { createSelector } from 'reselect';

import { OrderScan, State } from '../store/reduxStoreState';
import { getOrderFromProps } from "./orderSelectors";
import { createDeepEqualSelector } from "./utilSelectors";

/**Return an object of Order Scans, with each property being the orderScanId
 * {[orderScanId]: OrderScan,...}
 * */
export const getOrderScans = (state: State): { [orderScanId: number]: OrderScan } => {
    return state.api.entities.orderScans;
}

/**Returns an array of Order Scan Ids*/
const getOrderScanIdsForOrderFromProps = createSelector([getOrderFromProps], (order): number[] => {
    console.log('#### create selector getOrderScanIdsForOrderFromProps is running!!!!');
    return order && order.scannedProductOrderDetailAssociationsScans ? order.scannedProductOrderDetailAssociationsScans : [];
})

/**Returns count of scans for an order*/
export const getOrderScanCountForOrderFromProps = (state: State, {orderId}): number => {
    return getOrderScanIdsForOrderFromProps(state, {orderId}).length;
}

/**Returns an object of orderDetailIds and OrderScan objects {[orderDetailId]: [OrderScan]}*/
export const getOrderScansForOrderFromProps = createDeepEqualSelector(
    [getOrderScanIdsForOrderFromProps, getOrderScans],
    (orderScanIds, orderScans): { [orderDetailId: number]: OrderScan[] } => {
        console.log('!!!#### createSelector getOrderscansForOrderFromProps is running!!!!');
        if (orderScanIds.length > 0 && orderScanIds.length > 0) {
            const scansForOrder = {};
            orderScanIds.forEach(scanId => {
                const orderScan = orderScans[scanId];
                const orderDetailId = orderScan.orderDetail;
                scansForOrder[orderDetailId] = scansForOrder[orderDetailId]
                    ? scansForOrder[orderDetailId] = [...scansForOrder[orderDetailId], orderScan]
                    : [orderScan];
            })
            return scansForOrder;
        }
        return {};
    })

/**Return true if scans for each orderDetail match the quantity of each orderDetail. Otherwise return false
 * -> the results of this selector are intended to be used in conjunction with the results of other selectors (e.g. isMetrcDSPR)
 * -> a sample flow would be: 1. check if dspr requires items to be scanned 2. if so, check if scanning is complete before showing complete order button
 *
 * -> in general, it does not make sense to check/use the results of isScanningComplete if the dspr does not require scans
 * */
export const isScanningCompleteForOrderFromProps = createSelector([getOrderScansForOrderFromProps, getOrderFromProps], (orderScans, order): boolean => {
    if (order && order.orderDetails) {
        for (let orderDetail of order.orderDetails) {
            //if orderDetailId does not exist as a key on orderScans, or the value of orderScans[orderDetailId] and orderDetailQuantity are not equal, return false
            if (!orderScans[orderDetail.id] || orderScans[orderDetail.id] && orderScans[orderDetail.id].length !== orderDetail.quantity){
                return false;
            }
        }
        return true;
    }
    return false;
})

/**Returns an array of OrderScan objects for a particular order detail
 * WARNING: unless only one order detail is needed, it is most efficient to simply use the getOrderScansForOrderFromProps Selector
 * and then derive the needed information (this way, only one object needs to be created)
 * */
export const getOrderScansForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): OrderScan[] => {
    const orderScans = getOrderScansForOrderFromProps(state, {orderId});
    return orderScans && orderScans[orderDetailId] ? orderScans[orderDetailId] : [];
}

/**Returns count of scans for a particular order detail
 * WARNING: unless info for only one order detail is needed, it is most efficient to simply use the getOrderScansForOrderFromProps Selector
 * and then derive the needed information (this way, only one object needs to be created)
 * */
export const getOrderScanCountForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): number => {
    return getOrderScansForOrderDetailFromProps(state, {orderId, orderDetailId}).length;
}