/**
 * Created by exialym on 2017/2/6.
 */
var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: '/public'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      { test: /\.js$/,
        exclude: /(node_modules|lib)/,
        loader: 'babel-loader?presets[]=es2015'
      }
    ]
  }
}