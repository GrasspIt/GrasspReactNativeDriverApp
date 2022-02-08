export const APPEND_LOCATION_HISTORY = "APPEND_LOCATION_HISTORY";
export const UPDATE_LAST_LOCATION_TIME = "UPDATE_LAST_LOCATION_TIME";

const addLocationToHistory = (locationObject) => {
    return {
        type: APPEND_LOCATION_HISTORY,
        location: locationObject
    }
}

export const appendLocationHistory = (locationObject) => (dispatch, getState) => {
    return dispatch(addLocationToHistory(locationObject))
}

const updateLastLocationUpdateTime = () => {
    return {
        type: UPDATE_LAST_LOCATION_TIME,
    }
}

export const updateLastLocationUpdate = () => (dispatch, getState) => {
    return dispatch(updateLastLocationUpdateTime());
}