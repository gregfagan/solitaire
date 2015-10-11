import _ from 'lodash';
import webpack from 'webpack';
import os from 'os';
import baseConfig from './webpack.base.config';

const netInterfaces = os.networkInterfaces();
const addresses = _(netInterfaces)
  .map(value => value)
  .flatten()
  .filter(netInterface => (netInterface.family === 'IPv4' && !netInterface.internal))
  .map(netInterface => netInterface.address)
  .value();

const devServerConfig = {
  hostname: _.first(addresses),
  port: 8080,
};

const { entry:baseEntry, plugins:basePlugins, ...otherBaseConfig } = baseConfig;

const config = {
  ...devServerConfig,
  ...otherBaseConfig,
  devtool: 'eval',
  entry: [
    `webpack-dev-server/client?http://${devServerConfig.hostname}:${devServerConfig.port}`,
    'webpack/hot/dev-server',
    ...baseEntry,
  ],
  plugins: [
    ...basePlugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
};

export default config;