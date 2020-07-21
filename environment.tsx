import Constants from "expo-constants";

const ENV = {
 dev: {
   apiUrl: "https://api.staging.grasspit.com/",
 },
 staging: {
   apiUrl: "https://api.staging.grasspit.com/",
 },
 prod: {
   apiUrl: "https://api.grassp.it/",
 }
};

export const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // __DEV__ is true when run locally, but false when published.
 if (env === 'staging') {
   return ENV.staging;
 } else if (env === 'prod') {
   return ENV.prod;
 }
 return ENV.dev
};