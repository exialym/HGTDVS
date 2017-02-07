/**
 * Created by exialym on 2017/2/6.
 */
var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname + 'public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}