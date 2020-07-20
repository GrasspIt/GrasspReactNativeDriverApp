import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import ScreenNavigator from './navigation/ScreenNavigator';
import rootReducer from './reducers/rootReducer';
import * as Sentry from 'sentry-expo';
import 'dotenv/config';

Sentry.init({
  dsn: 'YOUR DSN HERE',
  enableInExpoDevelopment: false,
  debug: true,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default function App() {
  return (
    <Provider store={store}>
      <ScreenNavigator />
    </Provider>
  );
}
