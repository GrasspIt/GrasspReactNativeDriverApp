import { State } from '../store/reduxStoreState';

export const getSessionLocations = (state: State) => state.locations.locations.reverse();

export const getLastUpdateTime = (state: State) => state.locations.lastLocationUpdateTime;