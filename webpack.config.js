require('babel/register');
module.exports = require(
  process.env.PRODUCTION ?
    './webpack.production.config.js' :
    './webpack.dev.config.js'
);