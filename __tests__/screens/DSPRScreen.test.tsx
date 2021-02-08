import React from 'react';
import { renderWithRedux } from '../../jest/renderWithRedux';

import DSPRScreen from '../../screens/DSPRScreen';

describe('<DSPRScreen />', () => {
  it('should render with given state from Redux store', async () => {
    await expect(renderWithRedux(<DSPRScreen />).toJSON()).toMatchSnapshot();
  });
  //   it('should dispatch an action on button click', () => {

  // });
});
