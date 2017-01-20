/* eslint-disable */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/app/main.js',
  output: {
    path: './public/js/',
    filename: 'game.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      },
    ]
  },
};
