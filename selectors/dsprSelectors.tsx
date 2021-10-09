import { createSelector } from 'reselect';

import { State } from '../store/reduxStoreState';

export const getDSPRFromProps = (state: State, {dsprId}) => state.api.entities.DSPRs[dsprId];

/**Returns true if dspr has a metrc license. Otherwise returns false*/
export const isMetrcDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && dspr.metrcLicense)
)

/**Returns true if dspr requires scanning but does not have a metrc license. Otherwise returns false*/
export const isNonMetrcScanningDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && dspr.isScanOrderDetail)
)

/**Returns true either if dspr has a metrc license or does not have a metrc license but requires scanning. Otherwise returns false*/
export const isScanningRequiredForDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && (dspr.isScanOrderDetail || dspr.metrcLicense))
)