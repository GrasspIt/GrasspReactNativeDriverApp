import { CALL_API, Schemas } from '../middleware/api';
import { getDSPRDriver } from './driverActions';
import { getDSPR } from './dsprActions';

import { getDriverInventoryPeriodFromProps } from '../selectors/dsprDriverSelector';

export const CREATE_INVENTORY_PERIOD = 'CREATE_INVENTORY_PERIOD';
export const CREATE_INVENTORY_PERIOD_SUCCESS = 'CREATE_INVENTORY_PERIOD_SUCCESS';
export const CREATE_INVENTORY_PERIOD_FAILURE = 'CREATE_INVENTORY_PERIOD_FAILURE';

const inventoryPeriodCreator = (dsprDriver, cashOnHand, items) => {
  const dsprDriverInventoryPeriod = {
    dspr: {
      id: dsprDriver.dspr,
    },
    driver: {
      id: dsprDriver.id,
    },
    cashOnHand,
    dsprDriverInventoryItems: items.map((item) => ({
      product: {
        id: item.productId,
      },
      quantityInitial: item.quantity,
    })),
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        CREATE_INVENTORY_PERIOD,
        CREATE_INVENTORY_PERIOD_SUCCESS,
        CREATE_INVENTORY_PERIOD_FAILURE,
      ],
      endPoint: 'dspr/driver/inventory_period',
      schema: Schemas.DSPR_DRIVER_INVENTORY_PERIOD,
      body: dsprDriverInventoryPeriod,
    },
  };
};

export const createInventoryPeriod = (dsprDriver, cashOnHand, items) => (dispatch, getState) => {
  return dispatch(inventoryPeriodCreator(dsprDriver, cashOnHand, items))
    .then((response) => {
      dispatch(getDSPRDriver(dsprDriver.id));
      return response;
    })
    .then((responseTwo) => {
      dispatch(getDSPR(dsprDriver.dspr));
      return responseTwo;
    });
};

export const GET_DRIVER_INVENTORY_PERIOD = 'GET_DRIVER_INVENTORY_PERIOD';
export const GET_DRIVER_INVENTORY_PERIOD_SUCCESS = 'GET_DRIVER_INVENTORY_PERIOD_SUCCESS';
export const GET_DRIVER_INVENTORY_PERIOD_FAILURE = 'GET_DRIVER_INVENTORY_PERIOD_FAILURE';

const inventoryPeriodGetter = (inventoryPeriodId) => {
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [
        GET_DRIVER_INVENTORY_PERIOD,
        GET_DRIVER_INVENTORY_PERIOD_SUCCESS,
        GET_DRIVER_INVENTORY_PERIOD_SUCCESS,
      ],
      endPoint: `dspr/driver/inventory_period/${inventoryPeriodId}`,
      schema: Schemas.DSPR_DRIVER_INVENTORY_PERIOD,
    },
  };
};

export const getInventoryPeriod = (inventoryPeriodId) => (dispatch, getState) => {
  return dispatch(inventoryPeriodGetter(inventoryPeriodId));
};

export const REMOVE_INVENTORY_ITEM_FROM_PERIOD = 'REMOVE_INVENTORY_ITEM_FROM_PERIOD';
export const REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS =
  'REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS';
export const REMOVE_INVENTORY_ITEM_FROM_PERIOD_FAILURE =
  'REMOVE_INVENTORY_ITEM_FROM_PERIOD_FAILURE';

const driverPeriodWithSingleItem = (inventoryPeriodId, productId, quantityInitial = null) => {
  return {
    id: inventoryPeriodId,
    dsprDriverInventoryItems: [
      {
        product: {
          id: productId,
        },
        quantityInitial,
      },
    ],
  };
};

const inventoryItemRemover = (inventoryPeriodId, productId) => {
  const dsprDriverInventoryPeriod = driverPeriodWithSingleItem(inventoryPeriodId, productId);

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        REMOVE_INVENTORY_ITEM_FROM_PERIOD,
        REMOVE_INVENTORY_ITEM_FROM_PERIOD_SUCCESS,
        REMOVE_INVENTORY_ITEM_FROM_PERIOD_FAILURE,
      ],
      endPoint: 'dspr/driver/inventory_period/remove_items',
      schema: Schemas.DSPR_DRIVER_INVENTORY_PERIOD,
      body: dsprDriverInventoryPeriod,
    },
  };
};

export const removeInventoryItem = (inventoryPeriodId, productId) => (dispatch, getState) => {
  return dispatch(inventoryItemRemover(inventoryPeriodId, productId)).then(() => {
    const inventoryPeriod = getDriverInventoryPeriodFromProps(getState(), {
      dsprDriverInventoryPeriodId: inventoryPeriodId,
    });
    return dispatch(getDSPR(inventoryPeriod.dspr));
  });
};

export const ADD_INVENTORY_ITEM_TO_PERIOD = 'ADD_INVENTORY_ITEM_TO_PERIOD';
export const ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS = 'ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS';
export const ADD_INVENTORY_ITEM_TO_PERIOD_FAILURE = 'ADD_INVENTORY_ITEM_TO_PERIOD_FAILURE';

const inventoryItemAdder = (inventoryPeriodId, productId, quantityInitial) => {
  const dsprDriverInventoryPeriod = driverPeriodWithSingleItem(
    inventoryPeriodId,
    productId,
    quantityInitial
  );

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ADD_INVENTORY_ITEM_TO_PERIOD,
        ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS,
        ADD_INVENTORY_ITEM_TO_PERIOD_SUCCESS,
      ],
      endPoint: 'dspr/driver/inventory_period/add_items',
      schema: Schemas.DSPR_DRIVER_INVENTORY_PERIOD,
      body: dsprDriverInventoryPeriod,
    },
  };
};

export const addInventoryItem = (inventoryPeriodId, productId, quantity) => (
  dispatch,
  getState
) => {
  return dispatch(inventoryItemAdder(inventoryPeriodId, productId, quantity)).then(() => {
    const inventoryPeriod = getDriverInventoryPeriodFromProps(getState(), {
      dsprDriverInventoryPeriodId: inventoryPeriodId,
    });
    return dispatch(getDSPR(inventoryPeriod.dspr));
  });
};

export const TRANSFER_INVENTORY_PERIOD = 'TRANSFER_INVENTORY_PERIOD';
export const TRANSFER_INVENTORY_PERIOD_SUCCESS = 'TRANSFER_INVENTORY_PERIOD_SUCCESS';
export const TRANSFER_INVENTORY_PERIOD_FAILURE = 'TRANSFER_INVENTORY_PERIOD_FAILURE';

const inventoryPeriodTransferrer = (transferrerDriverId, transfereeDriverId) => {
  const inventoryPeriodTransferrer = {
    transferrer: {
      id: transferrerDriverId,
    },
    transferee: {
      id: transfereeDriverId,
    },
  };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        TRANSFER_INVENTORY_PERIOD,
        TRANSFER_INVENTORY_PERIOD_SUCCESS,
        TRANSFER_INVENTORY_PERIOD_FAILURE,
      ],
      endPoint: 'dspr/driver/inventory_period/transfer',
      schema: Schemas.DSPR_DRIVER_INVENTORY_PERIOD,
      body: inventoryPeriodTransferrer,
    },
  };
};

export const transferInventoryPeriod = (transferrerDriverId, transfereeDriverId) => (
  dispatch,
  getState
) => {
  return dispatch(inventoryPeriodTransferrer(transferrerDriverId, transfereeDriverId));
};
