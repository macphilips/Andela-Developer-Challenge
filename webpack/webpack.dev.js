const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const path = require('path');

module.exports = webpackMerge(commonConfig({env: 'dev', apiUrl: 'http://localhost:3000'}), {
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
});
