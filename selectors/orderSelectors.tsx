import { getAddresses } from './addressSelectors';
import { Address, State, Order, OrderWithAddressAndUser } from '../store/reduxStoreState';
import { createSelector } from 'reselect';
import { getUserMedicalRecommendations, getUserIdDocuments } from './userDocumentsSelector';
import { getUsers } from './userSelectors';

export const getOrders = (state: State) =>
  state.api && state.api.entities ? state.api.entities.orders : undefined;

export const getOrderFromProps = (state: State, props) =>
  state.api && state.api.entities ? state.api.entities.orders[props.orderId] : undefined;

export const getOrderDetailFromProps = (state: State, {orderId, orderDetailId}) => {
    const order = getOrderFromProps(state, {orderId});
    return order?.orderDetails.find(orderDetail => orderDetail.id === orderDetailId);
}

export const getOrdersForUser = (state: State, props) => {
  const orders = state.api.entities.orders;
  const addresses = getAddresses(state);
  return orders && props && props.userId && addresses
    ? Object.keys(orders)
        .filter((key) => orders[key].user === Number.parseInt(props.userId, 10))
        .map((key) => {
          return {
            ...orders[key],
            address: addresses[orders[key].address],
            driver:
              state.api.entities.users[state.api.entities.dsprDrivers[orders[key].dsprDriver].user],
          };
        })
    : null;
};

export const getOrdersWithAddresses = createSelector(
  [getOrders, getAddresses],
  (orders, addresses) => {
    let ordersMap = {};
    orders
      ? addresses
        ? Object.values(orders).forEach((order) => {
            ordersMap[order.id] = { ...order, address: addresses[order.address] };
          })
        : (ordersMap = orders)
      : ordersMap;

    return ordersMap;
  }
);

const mapAddressIntoOrder = (orderId, orders, addresses, users, medRecs, idDocs) => {
  if (!orderId) return null;
  let order = orders[orderId];
  let user = users[order.user] || order.user;
  const returnOrder = { ...order, address: addresses[order.address], user };
  if (order.userMedicalRecommendation)
    returnOrder['medicalRecommendation'] = medRecs[order.userMedicalRecommendation];
  if (order.userIdentificationDocument)
    returnOrder['userIdentificationDocument'] = idDocs[order.userIdentificationDocument];
  return returnOrder;
};

export const getOrdersWithAddressesAndUsers = createSelector(
  [getOrders, getUsers, getAddresses, getUserMedicalRecommendations, getUserIdDocuments],
  (orders, users, addresses, medicalRecs, idDocs) => {
    let ordersWithAddressesAndUsers: any = {};

    if (orders) {
      if (users && addresses && medicalRecs && idDocs) {
        Object.values(orders).forEach((order) => {
          ordersWithAddressesAndUsers[order.id] = mapAddressIntoOrder(
            order.id,
            orders,
            addresses,
            users,
            medicalRecs,
            idDocs
          );
        });
      } else {
        ordersWithAddressesAndUsers = orders;
      }
    } else {
      ordersWithAddressesAndUsers = undefined;
    }
    return ordersWithAddressesAndUsers;
  }
);

const getDSPRDriverFromProps = (state: State, props) => state.api.entities.dsprDrivers[props.dsprDriverId];

// TODO: possibly delete
export const getQueuedAndInProcessOrdersWithAddressesForDriverFromProps = createSelector(
  [getDSPRDriverFromProps, getOrdersWithAddresses], (driver, ordersWithAddresses) => {
    const ordersWithAddressesForDriver = {};

    if (driver && ordersWithAddresses) {

      if(driver.currentInProcessOrder) {
        const inProcessOrderId = driver.currentInProcessOrder;
        ordersWithAddressesForDriver[inProcessOrderId] = ordersWithAddresses[inProcessOrderId];
      }

      if(driver.queuedOrders && driver.queuedOrders.length > 0) {
        driver.queuedOrders.forEach(orderId => {
          ordersWithAddressesForDriver[orderId] = ordersWithAddresses[orderId];
        })
      }
    }

    return ordersWithAddressesForDriver;
  }
);

export const  getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps = createSelector(
  [getDSPRDriverFromProps, getOrdersWithAddresses, getUsers], (driver, ordersWithAddresses, users) => {
    let ordersWithAddressesAndUsers:OrderWithAddressAndUser[]  = [];

    if (driver.queuedOrders && driver.queuedOrders.length > 0) {
      const queuedOrders = driver.queuedOrders.map((orderId) => {
        const queuedOrder = ordersWithAddresses[orderId];
        queuedOrder.user = users[queuedOrder.user];
        return queuedOrder;
      }
    )
      ordersWithAddressesAndUsers = queuedOrders;
    }

    if (driver.currentInProcessOrder) {
      const order = ordersWithAddresses[driver.currentInProcessOrder];
      order.user = users[order.user];
      ordersWithAddressesAndUsers.push(order);
    }

    return ordersWithAddressesAndUsers;
  });

export const getProductsInOrderFromProps = (state: State, props: { orderId: number }): ProductInOrder[] => {
    //const orders = state.api && state.api.entities && state.api.entities.orders ? state.api.entities.orders[orderId] : undefined;
    const order = state.api?.entities?.orders[props.orderId];
    const dsprId = order?.dspr;

    return order.orderDetails?.map(orderDetail => {
        const { id: productId, name } = orderDetail.product;
        return {
            orderDetailId: orderDetail.id,
            productId,
            name,
            quantity: orderDetail.quantity,
            dsprId
        }
    })
}

export interface ProductInOrder {
    orderDetailId: number,
    productId: number;
    name: string;
    quantity: number;
    dsprId: number;
}