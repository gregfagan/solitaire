import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: 'build'
}).listen(config.port, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at ${config.hostname}:${config.port}`);
});