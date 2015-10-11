import webpack from 'webpack';
import baseConfig from './webpack.base.config.js';

const { plugins: basePlugins, ...otherBaseConfig } = baseConfig;

const config = {
  ...otherBaseConfig,
  plugins: [
    ...basePlugins,
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
}

export default config;