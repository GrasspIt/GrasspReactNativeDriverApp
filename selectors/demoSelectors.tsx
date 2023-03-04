import { State } from '../store/reduxStoreState';

export const getAddresses = (state: State) =>
  state.api && state.api.isDemo