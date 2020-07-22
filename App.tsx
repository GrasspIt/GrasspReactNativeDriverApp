import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ScreenNavigator from './navigation/ScreenNavigator';
import rootReducer from './reducers/rootReducer';
import api from './middleware/api';
import { createLogger } from 'redux-logger';
// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'YOUR DSN HERE',
//   enableInExpoDevelopment: false,
//   debug: true,
// });

const store = createStore(
  rootReducer, applyMiddleware(thunk, api, createLogger())
);

export default function App() {
  return (
    <Provider store={store}>
      <ScreenNavigator />
    </Provider>
  );
}
