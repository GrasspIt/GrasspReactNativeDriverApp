import React from 'react';
import { renderWithRedux } from '../../jest/renderWithRedux';

import LoginScreen from '../../screens/LoginScreen';

describe('<LoginScreen />', () => {
  it('should render with given state from Redux store', async () => {
    await expect(renderWithRedux(<LoginScreen />).toJSON()).toMatchSnapshot();
  });
  //   it('should dispatch an action on button click', () => {

  // });
});
