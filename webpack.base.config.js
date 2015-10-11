import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: [
    './app/js/main.js',
  ],
  output: {
    path: path.join(__dirname, "build"),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?stage=0' },
      { test: /svgCards\/.+\.svg$/, loaders: ['url-loader?limit=16384', 'svgo-loader?useConfig=svgo', '../../../card-image-loader'] },
      { test: /\.svg$/, exclude: /svgCards/, loaders: ['url-loader?limit=16384', 'svgo-loader?useConfig=svgo'] },
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
    new webpack.NoErrorsPlugin()
  ],
  svgo: {
    // this plugin is not compatible with the source images
    plugins: [ { convertTransform: false } ]
  }
};

export default config;