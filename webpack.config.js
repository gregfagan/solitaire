var stylus_plugin = require('nib');

module.exports = {
  entry: './app/js/main.js',
  output: {
    filename: './build/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx|\.js/, exclude: /node_modules/, loader: 'jsx-loader?harmony' },
      { test: /\.styl/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.svg$/, loader: 'file?name=./build/img/[name].[ext]'}
    ]
  },
  stylus: {
    use: [stylus_plugin()]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: ['js', 'node_modules']
  }
};
