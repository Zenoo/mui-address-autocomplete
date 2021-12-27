const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
var HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

module.exports = (env, argv) => {
  const dev = argv.mode === 'development';

  const plugins = [
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];

  if (dev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    entry: './test/index.js',
    devtool: dev ? 'source-map' : 'none',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] }
        }
      ]
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      path: path.resolve(__dirname, 'dist2/'),
      filename: 'bundle.js'
    },
    devServer: {
      port: 3000,
    },
    plugins
  };
};