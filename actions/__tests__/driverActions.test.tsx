import * as actions from '../driverActions';

describe('setDriverId', () => {
  it('should create an action to set the driver id', () => {
    const driverId = 123;
    const expectedAction = {
      type: actions.SET_DSPR_DRIVER_ID,
      payload: driverId,
    };
    expect(actions.setDriverId(driverId)).toEqual(expectedAction);
  });
});
