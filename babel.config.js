module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // env: {
    //   prod: {
    //     plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
    //   },
    //   dev: {
    //     plugins: ['react-native-reanimated/plugin'],
    //   }, 
    //   staging: {
    //     plugins: ['react-native-reanimated/plugin'],
    //   }
    // },
    plugins: ['react-native-paper/babel', '@babel/plugin-proposal-export-namespace-from','react-native-reanimated/plugin'],
  };
};
