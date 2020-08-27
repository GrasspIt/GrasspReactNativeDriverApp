import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ScreenNavigator from './navigation/ScreenNavigator';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';

// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'YOUR DSN HERE',
//   enableInExpoDevelopment: false,
//   debug: true,
// });

const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: DefaultTheme.colors.surface,
    error: '#B00020',
    text: DefaultTheme.colors.text,
    onBackground: '#000000',
    onSurface: '#000000',
    notification: DefaultTheme.colors.notification,
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <ScreenNavigator />
      </PaperProvider>
    </Provider>
  );
}

// AppRegistry.registerComponent(appName, () => App);
