import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ScreenNavigator from './navigation/ScreenNavigator';
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';

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

// AppRegistry.registerComponent(appName, () => App);
