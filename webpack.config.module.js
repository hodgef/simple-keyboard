/**
 * Config to support ESModules in modern browsers (build/mjs/index.js)
 */
 const path = require('path');
 const webpack = require('webpack');
 const PrettierPlugin = require("prettier-webpack-plugin");
 const TerserPlugin = require('terser-webpack-plugin');
 const getPackageJson = require('./scripts/getPackageJson');
 const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
 
 const {
   version,
   name,
   license,
   repository,
   author,
 } = getPackageJson('version', 'name', 'license', 'repository', 'author');
 
 const banner = `
   ${name} v${version} (index.js - Ecmascript Module bundle)
   ${repository.url}
 
   NOTE: This modern browsers bundle (mjs/index.js) removes all polyfills
   included in the standard version. Use this if you are supporting
   modern browsers only. Otherwise, use the standard version (index.js).
 
   Copyright (c) ${author.replace(/ *<[^)]*> */g, " ")} and project contributors.
 
   This source code is licensed under the ${license} license found in the
   LICENSE file in the root directory of this source tree.
 `;
 
 module.exports = {
   mode: "production",
   entry: './src/lib/index.modern.ts',
   target: 'browserslist:last 2 versions',
   output: {
     filename: 'index.js',
     path: path.resolve(__dirname, 'build/mjs'),
     libraryTarget: 'module',
     chunkFormat: 'module',
     globalObject: 'this'
   },
   experiments: {
     outputModule: true
   },
   optimization: {
     minimize: true,
     minimizer: [
       new TerserPlugin({ extractComments: false }),
       new OptimizeCSSAssetsPlugin()
     ],
   },
   module: {
    rules: [
      {
        test: /\.m?(j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer"
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader'],
      }
    ]
  },
  plugins: [
    new PrettierPlugin(),
    new MiniCssExtractPlugin({
        filename: 'css/index.css'
    }),
    new webpack.BannerPlugin(banner)
  ],
   resolve: {
     extensions: ['.ts', '.js', '.json']
   }
 };