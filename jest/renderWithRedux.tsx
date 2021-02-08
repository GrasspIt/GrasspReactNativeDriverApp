// https://redux.js.org/recipes/writing-tests
// https://callstack.com/blog/react-native-testing-library-with-redux/

import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { store } from '../store/store';

const renderWithRedux = (component, { reduxStore = store, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react-native';
// override render method
export { renderWithRedux };
