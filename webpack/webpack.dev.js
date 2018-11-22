const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = webpackMerge(commonConfig({env: 'dev', apiUrl: 'http://localhost:3040'}), {
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true,
    proxy: [{
      context: [
        '/api',
      ],
      target: 'http://127.0.0.1:8080',
      secure: false
    }],
    watchOptions: {
      ignored: /node_modules/
    }
  },
// devtool: 'inline-source-map',
  devtool: 'eval-source-map',
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 9000,
      proxy: {
        target: 'http://localhost:9060'
      }
    }, {
      reload: false
    })
  ]
});
