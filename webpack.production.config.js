import webpack from 'webpack';
import baseConfig from './webpack.base.config.js';

const { output:baseOutput, plugins: basePlugins, ...otherBaseConfig } = baseConfig;
const { publicPath, ...otherOutput } = baseOutput;

const config = {
  ...otherBaseConfig,
  output: {
    ...otherOutput,
    publicPath: '/solitaire/',
  },
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