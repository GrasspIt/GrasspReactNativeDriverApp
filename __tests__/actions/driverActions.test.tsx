import * as actions from '../../actions/driverActions';
import configureMockStore from 'redux-mock-store'; // mock store
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const driverId = 123;
const dsprDriver = {
  id: 12,
  user: 12,
  dspr: 1,
  currentRoute: 12,
  serviceAreas: [1, 2],
};

describe('setDriverId', () => {
  it('creates an action to set the driver id in state', () => {
    const expectedAction = {
      type: actions.SET_DSPR_DRIVER_ID,
      payload: driverId,
    };
    expect(actions.setDriverId(driverId)).toEqual(expectedAction);
  });
});

// describe('dsprDriverGetter', () => {
//   it('creates an action to set the driver id in state', () => {
//     fetch.mockResponse(JSON.stringify({ access_token: '12345' }));
//     const expectedAction = {
//       type: actions.SET_DSPR_DRIVER_ID,
//       payload: driverId,
//     };
//     expect(actions.dsprDriverGetter(driverId)).toEqual(expectedAction);
//   });
// });
