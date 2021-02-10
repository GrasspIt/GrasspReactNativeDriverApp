import apiReducer, { initialState } from '../../reducers/apiReducer';
import * as driverActionTypes from '../../actions/driverActions';

describe('api reducer', () => {
  it('returns the initial state', () => {
    expect(apiReducer(undefined, {})).toEqual(initialState);
  });

  it('handles SET_DSPR_DRIVER_ID', () => {
    expect(
      apiReducer(initialState, {
        type: driverActionTypes.SET_DSPR_DRIVER_ID,
        payload: '12',
      })
    ).toEqual({ ...initialState, dsprDriverId: '12' });
  });
});
