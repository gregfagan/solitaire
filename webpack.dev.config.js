var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var stylus_plugin = require('nib');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
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
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?stage=1'] },
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
  stylus: {
    use: [stylus_plugin()]
  },
  svgo: {
    // this plugin is not compatible with the source images
    plugins: [ { convertTransform: false } ]
  }
}