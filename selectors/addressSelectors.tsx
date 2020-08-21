import { State } from '../store/reduxStoreState';

export const getAddresses = (state: State) =>
  state.api && state.api.entities ? state.api.entities.addresses : undefined;

export const getAddressFromProps = (state: State, props) =>
  state.api && state.api.entities ? state.api.entities.addresses[props.addressId] : undefined;
