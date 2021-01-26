const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const flexfixes = require('postcss-flexbugs-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { merge } = require('webpack-merge');

const env = process.env.npm_lifecycle_event === 'build' ? 'prod' : 'dev';
let config = {};

// config that is shared between all types of build (dev and prod)
const common = {
  entry: ['@babel/polyfill', 'whatwg-fetch', './<%= options.src %>/index.<% if (options.typescript) { %>t<% } else { %>j<% } %>s<% if (options.react) { %>x<% } %>'],

  output: {
    path: path.resolve(__dirname, '<%= options.dist %>'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      <% if (options.typescript) { %>
        {
          enforce: 'pre', // lint files before they are transformed, config in .eslintrc.json
          test: /\.(ts<% if (options.react) { %>|tsx<% } %>)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.(ts<% if (options.react) { %>|tsx<% } %>)$/,
          exclude: /node_modules/,
          loader: 'babel-loader' // config in .tsconfig
        },
        <% } else { %>
          {
            enforce: 'pre', // lint files before they are transformed, config in .eslintrc.json
            test: /\.(js<% if (options.react) { %>|jsx<% } %>)$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
          },
          {
            test: /\.(js<% if (options.react) { %>|jsx<% } %>)$/,
            exclude: /node_modules/,
            loader: 'babel-loader' // config in .babelrc
          },
        <% } %>
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 1024, // will insert a data URI if filesize < 1kb otherwise uses file-loader
          fallback: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './<%= options.src %>/index.html',
      hash: true
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify(env)}
    }),
    new webpack.ProvidePlugin({
      Promise: ['es6-promise', 'Promise']
    }),
    new StyleLintPlugin({
      context: path.resolve(__dirname, '<%= options.src %>'),
      files: '**/*.s?(a|c)ss'
    })
  ],

  resolve: {
    <% if (options.typescript) { %>
      extensions: ['.js', '.ts'<% if (options.react) { %>, '.jsx', '.tsx'<% } %>, '.json', '.scss'],
    <% } else { %>
      extensions: ['.js'<% if (options.react) { %>, '.jsx'<% } %>, '.json', '.scss'],
    <% } %>
    modules: [path.resolve(__dirname, '<%= options.src %>'), 'node_modules']
  }
};

// environment specific config
switch (env) {
  case 'dev':
    config = merge(common, {
      devtool: 'cheap-module-eval-source-map',

      devServer: {
        historyApiFallback: true // enables reloads of routed pages
        // if you need to proxy a backend server this is the place to do it:
        // see https://webpack.js.org/configuration/dev-server/#devserver-proxy
      },

      // because we need to use MiniCssExtractPlugin for prod, we have to specify the 'dev' scss test here
      // rather than in common, or else they get merged weirdly
      module: {
        rules: [
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      autoprefixer(),
                      flexfixes()
                    ]
                  }
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    includePaths: [path.resolve(__dirname, '<%= options.src %>')]
                  }
                }
              }
            ]
          }
        ]
      }
    });
    break;
  case 'prod':
    // most of the prod specific config is provided directly by webpack as we supplied the -p flag
    // but we want to only use MiniCssExtractPlugin for prod, not dev
    config = merge(common, {
      devtool: 'source-map',

      module: {
        rules: [
          {
            test: /\.scss$/,
            exclude: /node_modules/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [
                        autoprefixer(),
                        flexfixes()
                      ]
                    }
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sassOptions: {
                      includePaths: [path.resolve(__dirname, '<%= options.src %>')]
                    }
                  }
                }
              ]
          }
        ]
      },

      plugins: [
        new MiniCssExtractPlugin()
      ]
    });
    break;
  default:
    config = common;
}

module.exports = config;
