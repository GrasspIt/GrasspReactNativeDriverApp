import { APPEND_LOCATION_HISTORY, UPDATE_LAST_LOCATION_TIME } from "../actions/locationActions";
import { LocationState } from "../store/reduxStoreState";

const initialState:LocationState = {lastLocationUpdateTime: undefined, locations: new Array()};

export default (state = initialState, action) => {
    switch (action.type) {
        case APPEND_LOCATION_HISTORY:
            state.locations.push(action.location);
            return state;
        case UPDATE_LAST_LOCATION_TIME:
            state.lastLocationUpdateTime = new Date();
        default:
            return state;
    }
};