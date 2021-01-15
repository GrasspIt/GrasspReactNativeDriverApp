import { State } from '../store/reduxStoreState';

export const getDSPRs = (state: State) => state.api.entities.DSPRs;

export const getDSPRFromProps = (state: State, props) => state.api.entities.DSPRs[props.dsprId];
