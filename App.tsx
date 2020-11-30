import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthNavigator from './navigation/AuthNavigator';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import merge from 'deepmerge';

// const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';

// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'YOUR DSN HERE',
//   enableInExpoDevelopment: false,
//   debug: true,
// });
const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#4caf50',
    accent: '#357a38',
    background: PaperDefaultTheme.colors.background,
    surface: PaperDefaultTheme.colors.surface,
    error: PaperDefaultTheme.colors.error,
    text: PaperDefaultTheme.colors.text,
    onBackground: PaperDefaultTheme.colors.onBackground,
    onSurface: PaperDefaultTheme.colors.onSurface,
    notification: PaperDefaultTheme.colors.notification,
    disabled: PaperDefaultTheme.colors.disabled,
    placeholder: PaperDefaultTheme.colors.placeholder,
    backdrop: PaperDefaultTheme.colors.backdrop,
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    regular: PaperDefaultTheme.fonts.regular,
  },
};

// const theme = {
//   ...DefaultTheme,
//   dark: false,
//   roundness: 4,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#4caf50',
//     accent: '#357a38',
//     background: DefaultTheme.colors.background,
//     surface: DefaultTheme.colors.surface,
//     error: DefaultTheme.colors.error,
//     text: DefaultTheme.colors.text,
//     onBackground: DefaultTheme.colors.onBackground,
//     onSurface: DefaultTheme.colors.onSurface,
//     notification: DefaultTheme.colors.notification,
//     disabled: DefaultTheme.colors.disabled,
//     placeholder: DefaultTheme.colors.placeholder,
//     backdrop: DefaultTheme.colors.backdrop,
//   },
//   fonts: {
//     ...DefaultTheme.fonts,
//     regular: DefaultTheme.fonts.regular,
//   },
// };

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={CombinedDefaultTheme}>
        {/* <NavigationContainer theme={CombinedDefaultTheme}> */}
        <AuthNavigator />
        {/* </NavigationContainer> */}
      </PaperProvider>
    </Provider>
  );
}

// AppRegistry.registerComponent(appName, () => App);
