var path = require('path');
var webpack = require('webpack');


const resolve = path.join(__dirname, '/ui/dist');
module.exports = {
  entry: {
    app: './ui/src/app.js',
    account: './ui/src/signin.js',
    profile: './ui/src/profile.js',
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
  // module: {
  //   loaders: [{
  //     test: /\.js$/,
  //     exclude: /node_modules/,
  //     loader: 'babel-loader',
  //   }],
  // },
};
