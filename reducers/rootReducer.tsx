import { combineReducers } from 'redux';
import { LOGOUT } from '../actions/oauthActions';
import apiReducer from './apiReducer';

const appReducer = combineReducers({
  api: apiReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
