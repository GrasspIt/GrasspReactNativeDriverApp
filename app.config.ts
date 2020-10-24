// WARNING THIS ISN'T VERSIONED
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Grassp Driver App',
  slug: 'GrasspDriverApp',
  version: '1.0.0',
  sdkVersion: '38.0.0',
  platforms: ['ios', 'android'],
  orientation: 'portrait',
  icon: './assets/grasspLogo1024.png',
  splash: {
    image: './assets/iphoneplus_splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  privacy: 'unlisted',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.GrasspDriver.app',
    buildNumber: '1.0.0',
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ['location', 'fetch'],
    },
  },
  android: {
    package: 'com.GrasspHealth.DriverApp',
    googleServicesFile: './google-services.json',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    versionCode: 1,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  description: 'A mobile app for Grassp Health dispensary drivers.',
});
