import { State } from '../store/reduxStoreState';

export const getDSPRs = (state: State) => state.api.entities.DSPRs;

export const getDSPRFromProps = (state: State, props) => state.api.entities.DSPRs[props.dsprId];

export const isMetrcLicenseHeldByDSPRFromProps = (state: State, props: {dsprId}) => {
    const dspr = getDSPRFromProps(state, props);
    return !!(dspr && dspr.metrcLicense);
}