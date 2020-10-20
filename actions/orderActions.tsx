import { CALL_API, Schemas } from '../middleware/api';
import { getOrderFromProps } from '../selectors/orderSelectors';
import { getDSPRDriver, progressDSPRDriverRoute } from './driverActions';

export const COMPLETE_ORDER_PENDING = 'COMPLETE_ORDER_PENDING';
export const COMPLETE_ORDER = 'COMPLETE_ORDER';
export const COMPLETE_ORDER_SUCCESS = 'COMPLETE_ORDER_SUCCESS';
export const COMPLETE_ORDER_FAILURE = 'COMPLETE_ORDER_FAILURE';

const orderCompleter = (orderId) => {
  const order = {
    id: orderId,
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [COMPLETE_ORDER, COMPLETE_ORDER_SUCCESS, COMPLETE_ORDER_FAILURE],
      endPoint: `order/completed`,
      schema: Schemas.ORDER,
      body: order,
    },
  };
};

export const completeOrder = (orderId, routeId?) => (dispatch, getState) => {
  dispatch({ type: COMPLETE_ORDER_PENDING });
  dispatch(orderCompleter(orderId)).then((response) => {
    if (response.type === COMPLETE_ORDER_SUCCESS) {
      const order = getOrderFromProps(getState(), { orderId });
      order && dispatch(getDSPRDriver(order.dsprDriver));
      if (routeId) dispatch(progressDSPRDriverRoute(routeId));
    }
  });
};

export const CANCEL_ORDER_PENDING = 'CANCEL_ORDER_PENDING';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';

const orderCanceler = (orderId) => {
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [CANCEL_ORDER, CANCEL_ORDER_SUCCESS, CANCEL_ORDER_FAILURE],
      endPoint: 'order/canceled',
      body: { id: orderId },
      schema: Schemas.ORDER,
    },
  };
};

export const cancelOrder = (orderId) => (dispatch, getState) => {
  dispatch({ type: CANCEL_ORDER_PENDING });
  dispatch(orderCanceler(orderId)).then((response) => {
    if (response.type === CANCEL_ORDER_SUCCESS) {
      const order = getOrderFromProps(getState(), { orderId });
      order && dispatch(getDSPRDriver(order.dsprDriver));
    }
  });
};

export const MARK_IN_PROCESS_PENDING = 'MARK_IN_PROCESS_PENDING';
export const MARK_IN_PROCESS = 'MARK_IN_PROCESS';
export const MARK_IN_PROCESS_SUCCESS = 'MARK_IN_PROCESS_SUCCESS';
export const MARK_IN_PROCESS_FAILURE = 'MARK_IN_PROCESS_FAILURE';

const orderInProcessMarker = (orderId) => {
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [MARK_IN_PROCESS, MARK_IN_PROCESS_SUCCESS, MARK_IN_PROCESS_FAILURE],
      endPoint: 'order/in-process',
      body: { id: orderId },
      schema: Schemas.ORDER,
    },
  };
};

export const markOrderInProcess = (orderId) => (dispatch, getState) => {
  dispatch({ type: MARK_IN_PROCESS_PENDING });
  dispatch(orderInProcessMarker(orderId)).then((response) => {
    if (response.type === MARK_IN_PROCESS_SUCCESS) {
      const order = getOrderFromProps(getState(), { orderId });
      order && dispatch(getDSPRDriver(order.dsprDriver));
    }
  });
};

export const MODIFY_ORDER = 'MODIFY_ORDER';
export const MODIFY_ORDER_SUCCESS = 'MODIFY_ORDER_SUCCESS';
export const MODIFY_ORDER_FAILURE = 'MODIFY_ORDER_FAILURE';

const orderModifier = (
  oldOrderId: number,
  orderDetails: any[],
  newDriverId: number,
  couponCode?: string
) => {
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [MODIFY_ORDER, MODIFY_ORDER_SUCCESS, MODIFY_ORDER_FAILURE],
      endPoint: 'order/modified',
      body: {
        orderDetails,
        dsprDriver: { id: newDriverId },
        modifiedOrder: { id: oldOrderId },
        couponCode: couponCode || null,
      },
      schema: Schemas.ORDER,
    },
  };
};

export const modifyOrder = (
  oldOrderId: number,
  orderDetails: any[],
  newDriverId: number,
  couponCode?: string
) => (dispatch) => {
  return dispatch(orderModifier(oldOrderId, orderDetails, newDriverId, couponCode));
};

export const GET_ORDER_COST = 'GET_ORDER_COST';
export const GET_ORDER_COST_SUCCESS = 'GET_ORDER_COST_SUCCESS';
export const GET_ORDER_COST_FAILURE = 'GET_ORDER_COST_FAILURE';

const orderCostGetter = (order) => ({
  [CALL_API]: {
    httpAction: 'POST',
    types: [GET_ORDER_COST, GET_ORDER_COST_SUCCESS, GET_ORDER_COST_FAILURE],
    endPoint: 'order/cost',
    body: order,
    schema: Schemas.ORDER,
  },
});

export const getOrderCost = (order) => (dispatch) => {
  return dispatch(orderCostGetter(order));
};

export const ORDER_DETAILS_PENDING = 'ORDER_DETAILS_PENDING';
export const GET_ORDER_DETAILS_WITH_ID = 'GET_ORDER_DETAILS_WITH_ID';
export const GET_ORDER_DETAILS_WITH_ID_SUCCESS = 'GET_ORDER_DETAILS_WITH_ID_SUCCESS';
export const GET_ORDER_DETAILS_WITH_ID_FAILURE = 'GET_ORDER_DETAILS_WITH_ID_FAILURE';

const orderGetter = (orderId: number) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_ORDER_DETAILS_WITH_ID,
        GET_ORDER_DETAILS_WITH_ID_SUCCESS,
        GET_ORDER_DETAILS_WITH_ID_FAILURE,
      ],
      endPoint: `order/${orderId}`,
      schema: Schemas.ORDER,
    },
  };
};

export const getOrderDetailsWithId = (orderId: number) => (dispatch) => {
  dispatch({ type: ORDER_DETAILS_PENDING });
  dispatch(orderGetter(orderId));
};
