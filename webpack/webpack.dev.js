const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const webpack = require('webpack');
const path = require('path');

module.exports = webpackMerge(commonConfig, {
  devServer: {// Required for docker
    publicPath: '/assets/',
    contentBase: path.join(__dirname, '../ui'),
    watchContentBase: true,
    compress: true,
    port: 9001,
    proxy: {
      '/api': 'http://127.0.0.1:3050',
    },
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev'),
        SERVER_API_URL: JSON.stringify('http://localhost:3000'),
      },
    }),
  ],
});
