const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

module.exports = webpackMerge(commonConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('prod'),
        SERVER_API_URL: JSON.stringify('https://shielded-waters-94006.herokuapp.com'),
      },
    }),
  ],
});
