/* eslint-disable prefer-named-capture-group */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    entry: './test/index.tsx',
    devtool: dev ? 'source-map' : 'none',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] }
        }
      ]
    },
    resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
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
