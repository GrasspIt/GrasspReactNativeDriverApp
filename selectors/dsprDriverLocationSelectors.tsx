import { State } from '../store/reduxStoreState';

export const getLocations = (state: State, props) => state.api.entities.dsprDriverLocations;
