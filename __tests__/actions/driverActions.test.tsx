import * as actions from '../../actions/driverActions';

describe('setDriverId', () => {
  it('should create an action to set the driver id in state', () => {
    const driverId = 123;
    const expectedAction = {
      type: actions.SET_DSPR_DRIVER_ID,
      payload: driverId,
    };
    expect(actions.setDriverId(driverId)).toEqual(expectedAction);
  });
});

// describe('getDSPRDriver', () => {
//   it('should fetch driver data from the api', () => {
//     const dsprDriver = {
//       id: 12,
//       user: 12,
//       dspr: 1,
//       currentRoute: 12,
//       serviceAreas: [1, 2],
//     };
//     const driverId = 123;
//     const expectedAction = {
//       type: actions.GET_DSPR_DRIVER,
//       payload: { dsprDriver },
//     };
//     expect(actions.getDSPRDriver(driverId)).toEqual(expectedAction);
//   });
// });
