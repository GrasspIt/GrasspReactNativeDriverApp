import { getAddresses } from './addressSelectors';
import { State } from '../store/reduxStoreState';

export const getOrders = (state: State) =>
  state.api && state.api.entities ? state.api.entities.orders : undefined;

export const getOrderFromProps = (state: State, props) =>
  state.api && state.api.entities
    ? state.api.entities.orders[props.orderId]
    : undefined;

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
              state.api.entities.users[
                state.api.entities.dsprDrivers[orders[key].dsprDriver].user
              ],
          };
        })
    : null;
};
