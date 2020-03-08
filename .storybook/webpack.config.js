const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: ["next/babel"],
    },
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.plugins = [new TsconfigPathsPlugin()];
  return config;
};