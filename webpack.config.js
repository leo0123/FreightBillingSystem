const path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    filename: 'FBSBundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  // plugins: [new webpack.ProvidePlugin({
  //   //Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
  //   'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
  // })],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true
  }
};
