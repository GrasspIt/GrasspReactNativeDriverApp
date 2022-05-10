import { createSelector } from 'reselect';

import { State } from '../store/reduxStoreState';

export const getDSPRFromProps = (state: State, {dsprId}) => state.api.entities.DSPRs[dsprId];

/**Returns true if dspr has a metrc license. Otherwise returns false*/
export const isMetrcDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && dspr.metrcLicense)
)

export const isBatchDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr)=> dspr && dspr.isBatchBased
)

/**Returns true if dspr requires scanning but does not have a metrc license. Otherwise returns false*/
export const isNonComplianceScanningDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && dspr.isScanOrderDetail && !dspr.metrcLicense && !dspr.isBatchBased)
)

/**Returns true either if dspr requires scanning. Otherwise returns false*/
export const isScanningRequiredForDSPRFromProps = createSelector(
    [getDSPRFromProps], (dspr) => !!(dspr && dspr.isScanOrderDetail)
)

export const getDSPRMetrcTagsFromProps = (state: State, {dsprId}) => {
    return state.api.entities.dsprMetrcTags[dsprId];
}

export interface ActiveMetrcTagForAutoComplete {
    id: string;
    title: string;
}

export const getDSPRActiveMetrcTagsForAutoComplete = createSelector(
    [getDSPRMetrcTagsFromProps], (dsprMetrcTags) => {
        return dsprMetrcTags
            ? Object.values(dsprMetrcTags)
            .filter(metrcTag => metrcTag.isActive === true)
            .map(metrcTag => {
                return {'id': metrcTag.id.toString(), 'title': metrcTag.metrcTag}
                 })
            : []
    }
);