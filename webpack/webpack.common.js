const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const resolve = path.join(__dirname, '../client/dist');
module.exports = ({ apiUrl, env }) => ({
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.scss']
  },
  entry: ['@babel/polyfill', path.join(__dirname, '../client/src/index.jsx')],
  output: {
    path: resolve,
    filename: 'app.bundle.js',
    // publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|server)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // "airbnb",
              '@babel/preset-env',
              '@babel/preset-react'
            ],
          },
        }
      },
      {
        loader: 'style-loader!css-loader',
        test: /\.css$/
      },
      {
        test: /\.scss$/,
        use: [
          env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loaders: ['file-loader?hash=sha512&digest=hex&name=content/[hash].[ext]']
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        SERVER_API_URL: JSON.stringify(apiUrl),
      },
    }),
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{ from: 'client/static' }]),
  ],

});
