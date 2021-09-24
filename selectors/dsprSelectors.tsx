import { State } from '../store/reduxStoreState';

export const getDSPRs = (state: State) => state.api.entities.DSPRs;

export const getDSPRFromProps = (state: State, {dsprId}) => state.api.entities.DSPRs[dsprId];

/**Returns true if dspr has a metrc license. Otherwise returns false*/
export const isMetrcLicenseHeldByDSPRFromProps = (state: State, {dsprId}): boolean => {
    const dspr = getDSPRFromProps(state, {dsprId});
    return !!(dspr && dspr.metrcLicense);
}

/**Returns true if dspr requires scanning but does not have a metrc license. Otherwise returns false*/
export const isNonMetrcScanningDSPRFromProps = (state: State, {dsprId}): boolean => {
    const dspr = getDSPRFromProps(state, {dsprId});
    return !!(dspr && dspr.isScanOrderDetail);
}

/**Returns true either if dspr has a metrc license or does not have a metrc license but requires scanning. Otherwise returns false*/
export const isScanningRequiredForDSPRFromProps = (state: State, {dsprId}): boolean => {
    const dspr = getDSPRFromProps(state, {dsprId});
    return !!(dspr && (dspr.metrcLicense || dspr.isScanOrderDetail))
}