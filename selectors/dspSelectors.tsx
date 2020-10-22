import { State } from '../store/reduxStoreState';

export const getDSPs = (state: State) => state.api.entities.deliveryServiceProviders;

export const getDSPsForNavBar = (state: State) =>
  Object.keys(state.api.entities.deliveryServiceProviders).map((dsp) => {
    return {
      id: state.api.entities.deliveryServiceProviders[dsp].id,
      name: state.api.entities.deliveryServiceProviders[dsp].name,
    };
  });

export const getDSPFromProps = (state: State, props) => {
  return state.api.entities.deliveryServiceProviders[props.dspId];
};
