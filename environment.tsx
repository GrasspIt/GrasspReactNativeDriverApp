import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: process.env.EXPO_STAGING_API_URL,
  },
  staging: {
    apiUrl: process.env.EXPO_STAGING_API_URL,
  },
  prod: {
    apiUrl: process.env.EXPO_PROD_API_URL,
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
