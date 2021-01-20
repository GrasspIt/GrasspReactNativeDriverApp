import apiReducer, { initialState } from '../apiReducer';
import * as driverActionTypes from '../../actions/driverActions';

describe('api reducer', () => {
  it('should return the initial state', () => {
    expect(apiReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SET_DSPR_DRIVER_ID', () => {
    expect(
      apiReducer(initialState, {
        type: driverActionTypes.SET_DSPR_DRIVER_ID,
        payload: '12',
      })
    ).toEqual({ ...initialState, dsprDriverId: '12' });
  });
});
