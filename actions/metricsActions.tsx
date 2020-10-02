import { CALL_API, Schemas } from '../middleware/api';
import { getMySQLDateStringFromTimestamp } from '../hooks/util';

export const GET_METRICS_FOR_USERS = 'GET_METRICS_FOR_USERS';
export const GET_METRICS_FOR_USERS_SUCCESS = 'GET_METRICS_FOR_USERS_SUCCESS';
export const GET_METRICS_FOR_USERS_FAILURE = 'GET_METRICS_FOR_USERS_FAILURE';

const getUserMetrics = (newUsersSinceDate: Date) => {
  const queryParamsMap = {
    since_date: getMySQLDateStringFromTimestamp(
      new Date(
        newUsersSinceDate.getFullYear(),
        newUsersSinceDate.getMonth(),
        newUsersSinceDate.getDate()
      )
    ),
  };
  return {
    [CALL_API]: {
      httpAction: 'GET',
      types: [GET_METRICS_FOR_USERS, GET_METRICS_FOR_USERS_SUCCESS, GET_METRICS_FOR_USERS_FAILURE],
      endPoint: `metrics/users`,
      schema: Schemas.METRIC,
      queryParamsMap,
    },
  };
};

export const getAllUserMetrics = (newUsersSinceDate: Date) => (dispatch) => {
  return dispatch(getUserMetrics(newUsersSinceDate));
};
