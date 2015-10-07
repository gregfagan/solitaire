import _ from 'lodash';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import os from 'os';

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

const config = {
  ...devServerConfig,
  devtool: 'eval',
  entry: [
    `webpack-dev-server/client?http://${devServerConfig.hostname}:${devServerConfig.port}`,
    'webpack/hot/dev-server',
    './app/js/main.js',
  ],
  output: {
    path: path.join(__dirname, "build"),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.styl/, loader: 'style!css!stylus' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?stage=0' },
      { test: /svgCards\/.+\.svg/, loaders: ['url-loader?limit=16384', 'svgo-loader?useConfig=svgo', '../../../card-image-loader'] },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.css'],
    root: path.join(__dirname, 'app'),
    modulesDirectories: ['js', 'node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Solitaire',
      template: 'app/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  svgo: {
    // this plugin is not compatible with the source images
    plugins: [ { convertTransform: false } ]
  }
};

export default config;