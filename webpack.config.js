const path = require('path');
// const webpack = require('webpack');


const resolve = path.join(__dirname, '/ui/dist');
module.exports = {
  entry: {
    app: './ui/src/app.js',
  },
  output: {
    path: resolve,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|server)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'airbnb',
              'env',
            ],
          },
        },
      },
    ],
  },
  devServer: {// Required for docker
    publicPath: '/assets/',
    contentBase: path.join(__dirname, './ui'),
    watchContentBase: true,
    compress: true,
    port: 9001,
    proxy: {
      '/api': 'http://127.0.0.1:3050',
    },
  },
  devtool: 'inline-source-map',
};
