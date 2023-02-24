import React from 'react';
import { Provider } from 'react-redux';
import * as Expo from "expo"
import { store } from './store/store';
import AuthNavigator from './navigation/AuthNavigator';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import * as Sentry from 'sentry-expo';
import { getEnvVars } from './environment';
const { debugSentry, enableNative } = getEnvVars();

Sentry.init({
  dsn: 'https://b663eac230f04197be6a4e605c67606b@o88449.ingest.sentry.io/5548189',
  enableInExpoDevelopment: false,
  debug: debugSentry,
  enableNative: enableNative,
});

//combine the default themes used by react-navigation and react-native-paper
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
    onBackground: PaperDefaultTheme.colors.background,
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

//workaround - unable to add 'info' property to ThemeColors in types.tsx and have it be accepted as a propert on the interface
export const infoColor = '#2196f3';

//create a ref to the main navigator to access from anywhere in the app
const navigationRef: React.RefObject<any> = React.createRef();
export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={CombinedDefaultTheme}>
        <NavigationContainer theme={CombinedDefaultTheme} ref={navigationRef}>
          <AuthNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default Expo.registerRootComponent(App);
