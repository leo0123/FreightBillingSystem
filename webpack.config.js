const path = require('path');
var webpack = require('webpack');

module.exports = {
  // entry: ["babel-polyfill", "./src/index.js"],
  entry: {
    // 'babel-polyfill': ["babel-polyfill"],
    FBSBundle: ["babel-polyfill", "./src/index.js"],
    FBSDisplayBundle: "./src/display.js"
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   // presets: ['es2015']
          //   "presets": [
          //     ["env", {
          //       "targets": {
          //         "browsers": ["last 2 versions", "ie >= 11"]
          //       },
          //         "useBuiltIns": true,
          //     }],
          //   ],
          //   "plugins": [
          //       "transform-remove-strict-mode"
          //   ]
          // }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
