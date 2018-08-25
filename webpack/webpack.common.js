const path = require('path');
const webpack = require('webpack');

const resolve = path.join(__dirname, '../ui/dist');
module.exports = (options) => ({
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(options.env),
        SERVER_API_URL: JSON.stringify(options.apiUrl),
      },
    }),
  ],
});
