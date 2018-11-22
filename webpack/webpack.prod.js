const commonConfig = require('./webpack.common');
const webpackMerge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = webpackMerge(commonConfig({
    env: 'prod',
    apiUrl: 'https://shielded-waters-94006.herokuapp.com'
  }),
  {
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new OptimizeCssAssetsPlugin(),
      new Visualizer({ filename: './statistics.html' })
    ],
  });
