import { OrderScan, State } from '../store/reduxStoreState';
import { getOrderFromProps } from "./orderSelectors";

/**Return an object of Order Scans, with each property being the orderScanId
 * {[orderScanId]: OrderScan,...}
 * */
export const getOrderScans = (state: State): {[orderScanId: number]: OrderScan} => {
    return state.api.entities.orderScans;
}

/**Returns an array of Order Scan Ids*/
const getOrderScanIdsForOrderFromProps = (state: State, {orderId}): number[] => {
    const order = getOrderFromProps(state, {orderId});
    return order && order.metrcOrderDetailAssociationsScans ? order.metrcOrderDetailAssociationsScans : [];
}

/**Returns count of scans for an order*/
export const getOrderScanCountForOrderFromProps = (state: State, {orderId}): number => {
    return getOrderScanIdsForOrderFromProps(state, {orderId}).length;
}

/**Returns an array of OrderScan objects for a particular order detail*/
export const getOrderScansForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): OrderScan[] => {
    const orderScans = getOrderScansForOrderFromProps(state, {orderId});
    return orderScans && orderScans[orderDetailId] ? orderScans[orderDetailId] : [];
}

/**Returns count of scans for a particular order detail*/
export const getOrderScanCountForOrderDetailFromProps = (state: State, {orderId, orderDetailId}): number => {
    return getOrderScansForOrderDetailFromProps(state, {orderId, orderDetailId}).length;
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