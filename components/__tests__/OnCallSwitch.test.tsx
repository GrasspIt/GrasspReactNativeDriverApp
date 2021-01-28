import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialState } from '../../reducers/apiReducer';
import { render } from '@testing-library/react-native';
import OnCallSwitch from '../OnCallSwitch';

const dsprDriver = {
  id: 12,
  user: 12,
  dspr: 1,
  currentRoute: 12,
  serviceAreas: [1, 2],
};

const setDriverOnCallState = jest.fn();

const mockStore = configureStore([]);

describe('<OnCallSwitch />', () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore(initialState);
    component = render(
      <Provider store={store}>
        <OnCallSwitch dsprDriver={dsprDriver} setDriverOnCallState={setDriverOnCallState} />
      </Provider>
    );
  });

  it('renders correctly', async () => {
    const tree = component.toJSON();
    await expect(tree).toMatchSnapshot();
  });
});
