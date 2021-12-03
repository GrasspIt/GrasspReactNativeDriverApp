import { CALL_API, Schemas } from '../middleware/api';

export const GET_DSPR = 'GET_DSPR';
export const GET_DSPR_SUCCESS = 'GET_DSPR_SUCCESS';
export const GET_DSPR_FAILURE = 'GET_DSPR_FAILURE';

const dspr = (dsprId) => {
    return {
        [CALL_API]: {
            httpAction: 'GET',
            types: [GET_DSPR, GET_DSPR_SUCCESS, GET_DSPR_FAILURE],
            endPoint: `dspr/${dsprId}`,
            schema: Schemas.DSPR,
        },
    };
};

export const getDSPR = (dsprId) => (dispatch) => {
    return dispatch(dspr(dsprId));
};

export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA =
    'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA';
export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS =
    'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS';
export const CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE =
    'CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE';

const createOrUpdateADsprServiceArea = (dsprDriverServiceArea) => {
    return {
        [CALL_API]: {
            httpAction: 'POST',
            types: [
                CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA,
                CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_SUCCESS,
                CREATE_OR_UPDATE_DSPR_DRIVER_SERVICE_AREA_FAILURE,
            ],
            endPoint: `dspr/driver-service-area`,
            schema: Schemas.DSPR_DRIVER_SERVICE_AREA,
            body: dsprDriverServiceArea,
        },
    };
};

export const createOrUpdateDsprServiceArea = (dsprDriverServiceArea) => (dispatch) => {
    return dispatch(createOrUpdateADsprServiceArea(dsprDriverServiceArea));
};

export const GET_DSPR_DRIVER_SERVICE_AREAS = 'GET_DSPR_DRIVER_SERVICE_AREAS';
export const GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS = 'GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS';
export const GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE = 'GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE';

const getDsprDriverServiceAreas = (dsprId: string) => {
    const queryParamsMap = {
        dspr_id: dsprId,
    };
    return {
        [CALL_API]: {
            httpAction: 'GET',
            types: [
                GET_DSPR_DRIVER_SERVICE_AREAS,
                GET_DSPR_DRIVER_SERVICE_AREAS_SUCCESS,
                GET_DSPR_DRIVER_SERVICE_AREAS_FAILURE,
            ],
            endPoint: `dspr/driver-service-area`,
            schema: Schemas.DSPR_DRIVER_SERVICE_AREA_ARRAY,
            queryParamsMap,
        },
    };
};

export const getAllDsprDriverServiceAreasForDspr = (dsprId: string) => (dispatch) => {
    return dispatch(getDsprDriverServiceAreas(dsprId));
};

export const GET_DSPR_ACTIVE_METRC_TAGS = 'GET_DSPR_ACTIVE_METRC_TAGS';
export const GET_DSPR_ACTIVE_METRC_TAGS_SUCCESS = 'GET_DSPR_ACTIVE_METRC_TAGS_SUCCESS';
export const GET_DSPR_ACTIVE_METRC_TAGS_FAILURE = 'GET_DSPR_ACTIVE_METRC_TAGS_FAILURE';

const dsprActiveMetrcTagsGetter = (dsprId: number) => {
    return {
        [CALL_API]: {
            httpAction: 'GET',
            types: [
                GET_DSPR_ACTIVE_METRC_TAGS,
                GET_DSPR_ACTIVE_METRC_TAGS_SUCCESS,
                GET_DSPR_ACTIVE_METRC_TAGS_FAILURE,
            ],
            endPoint: `metrc/association/active`,
            schema: Schemas.DSPR_METRC_TAG_ARRAY,
            queryParamsMap: { dsprId }
        },
    };
}

export const getActiveMetrcTagsForDSPR = (dsprId: number) => (dispatch) => {
    return dispatch(dsprActiveMetrcTagsGetter(dsprId));
}