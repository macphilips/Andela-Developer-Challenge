const path = require('path');

const resolve = path.join(__dirname, '../ui/dist');
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
};
