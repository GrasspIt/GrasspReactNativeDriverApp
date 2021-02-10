// https://callstack.com/blog/react-native-testing-library-with-redux/

import React from 'react';
import { renderWithRedux } from '../../jest/renderWithRedux';
import { fireEvent } from '@testing-library/react-native';

import LoginScreen from '../../screens/LoginScreen';

describe('<LoginScreen />', () => {
  let component;

  beforeEach(() => {
    component = renderWithRedux(<LoginScreen />);
  });

  it('renders with given state from Redux store', async () => {
    await expect(component.toJSON()).toMatchSnapshot();
  });
});
