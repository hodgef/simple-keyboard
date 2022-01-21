/**
 * Config to support modern browsers only (build/index.modern.js)
 */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version} (index.modern.js - Modern Browsers bundle)
  ${repository.url}

  NOTE: This modern browsers bundle (index.modern.js) removes all polyfills
  included in the standard version. Use this if you are supporting
  modern browsers only. Otherwise, use the standard version (index.js).

  Copyright (c) ${author.replace(/ *<[^)]*> */g, " ")} and project contributors.

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
  mode: "production",
  entry: './src/lib/index.modern.ts',
  target: 'es5',
  devtool: 'source-map',
  output: {
    filename: 'index.modern.js',
    path: path.resolve(__dirname, 'build'),
    library: "SimpleKeyboard",
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/env"]
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties"],
              ["@babel/plugin-transform-typescript"]
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: path.resolve('scripts/loaderMock.js')
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};