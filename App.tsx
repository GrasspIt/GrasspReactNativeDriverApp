import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ScreenNavigator from './navigation/ScreenNavigator';

// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'YOUR DSN HERE',
//   enableInExpoDevelopment: false,
//   debug: true,
// });

export default function App() {
  return (
    <Provider store={store}>
      <ScreenNavigator />
    </Provider>
  );
}
