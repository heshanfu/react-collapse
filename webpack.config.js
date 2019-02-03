/*
 * webpack 4+
 * */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

// const IsWebpackDevServer = /webpack-dev-server/.test(process.env.npm_lifecycle_script);

module.exports = (env = {}, argv = {}) => {
  const isProd = argv.mode === 'production';

  console.log('***', isProd ? 'prod' : 'dev', '***');

  let prodEntry = './src/production-entry';
  let devEntry = './src/development-entry';

  let config = {
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    mode: isProd ? 'production' : 'development',
    optimization: {
      minimizer: [
        isProd &&
          new UglifyJsPlugin({
            uglifyOptions: {
              mangle: true,
              compress: {
                drop_console: true,
              },
              output: {
                comments: false,
              },
            },
            cache: true,
            parallel: true,
            sourceMap: true,
            extractComments: true,
          }),
        isProd &&
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              sourcemap: false,
            },
          }),
      ].filter(Boolean),
    },
    entry: {
      Collapse: isProd ? [prodEntry] : [devEntry],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].js',
      filename: '[name].js',
      library: 'Collapse',
      libraryTarget: 'umd',
      publicPath: '/',
    },
    devServer: {
      //https: true,
      port: 6007,
      contentBase: path.join(__dirname, ''),
      publicPath: '/',
      open: true,
      hot: true,
      disableHostCheck: true,
      watchContentBase: true,
      historyApiFallback: true,
    },
    performance: {
      maxEntrypointSize: 8000,
      hints: 'warning',
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: isProd,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: path.join(__dirname, 'src'),
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          include: path.join(__dirname, 'src'),
          use: [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
              options: isProd
                ? {
                    publicPath: './',
                  }
                : {},
            },
            {
              loader: 'css-loader',
              options: {},
            },
            {
              loader: 'postcss-loader',
              options: {},
            },
            {
              loader: 'sass-loader',
              options: {},
            },
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      isProd && new CleanWebpackPlugin('dist', {}),
      new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[name]-[id].css' }),
      new HtmlWebpackPlugin({
        compile: false,
        inject: true,
        hash: true,
        template: 'src/index.html',
        filename: 'index.html',
      }),
      !isProd && new webpack.HotModuleReplacementPlugin(),
      new WebpackMd5Hash(),
    ].filter(Boolean),
    resolve: {
      //modules: [path.resolve(__dirname), 'node_modules'],
      extensions: ['.js', '.jsx', '.scss'],
      alias: {
        root: __dirname,
        src: path.resolve(__dirname, 'src'),
        components: path.resolve(__dirname, 'src/components'),
      },
    },
    externals: {},
  };

  if (isProd) {
    config.externals['react'] = {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    };
    config.externals['react-dom'] = {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    };
  }

  return config;
};
