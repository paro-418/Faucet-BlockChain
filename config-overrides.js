const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    path: require.resolve('path-browserify'),
    url: require.resolve('url'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};

// from STACK OVERFLOW

// If you are using create-react-app version >=5 you may run into issues building. This is because NodeJS polyfills are not included in the latest version of create-react-app.

// Solution:

// Install react-app-rewired and the missing modules

// If you are using yarn:

// yarn add --dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
// If you are using npm:

// npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
// Create config-overrides.js in the root of your project folder with the content:

// const webpack = require('webpack');

// module.exports = function override(config) {
//     const fallback = config.resolve.fallback || {};
//     Object.assign(fallback, {
//         "crypto": require.resolve("crypto-browserify"),
//         "stream": require.resolve("stream-browserify"),
//         "assert": require.resolve("assert"),
//         "http": require.resolve("stream-http"),
//         "https": require.resolve("https-browserify"),
//         "os": require.resolve("os-browserify"),
//         "url": require.resolve("url")
//     })
//     config.resolve.fallback = fallback;
//     config.plugins = (config.plugins || []).concat([
//         new webpack.ProvidePlugin({
//             process: 'process/browser',
//             Buffer: ['buffer', 'Buffer']
//         })
//     ])
//     return config;
// }
// Within package.json change the scripts field for start, build and test. Instead of react-scripts replace it with react-app-rewired before:

// "scripts": {
//     "start": "react-scripts start",
//     "build": "react-scripts build",
//     "test": "react-scripts test",
//     "eject": "react-scripts eject"
// },
// after:

// "scripts": {
//     "start": "react-app-rewired start",
//     "build": "react-app-rewired build",
//     "test": "react-app-rewired test",
//     "eject": "react-scripts eject"
// },
// The missing Nodejs polyfills should be included now and your app should be functional with web3.

// If you want to hide the warnings created by the console:

// In config-overrides.js within the override function, add:

// config.ignoreWarnings = [/Failed to parse source map/];
