import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: Constants.manifest.extra.stagingURL,
  },
  staging: {
    apiUrl: Constants.manifest.extra.stagingURL,
  },
  prod: {
    apiUrl: Constants.manifest.extra.prodURL,
  },
};

export const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // __DEV__ is true when run locally, but false when published.
  if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
  return ENV.dev;
};
