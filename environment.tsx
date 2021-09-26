import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const ENV = {
  dev: {
    apiUrl: 'https://api.staging.grasspit.com/',
    debugSentry: true,
    enableNative: false,
  },
  staging: {
    apiUrl: 'https://api.staging.grasspit.com/',
    debugSentry: false,
    enableNative: true,
  },
  prod: {
    apiUrl: 'https://api.grassp.it/',
    debugSentry: false,
    enableNative: true,
  },
};

//export const getEnvVars = (env = Constants.manifest.releaseChannel) => {
export const getEnvVars = (env = Updates.releaseChannel) => {
  // __DEV__ is true when run locally, but false when published.
  if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
  return ENV.dev;
};
