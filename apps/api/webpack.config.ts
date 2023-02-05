import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';

const isProduction =
  typeof process.env.NODE_ENV !== 'undefined' &&
  process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  optimization: {
    minimize: false,
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
  },
  target: 'node',
  mode,
  devtool,
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new RunScriptWebpackPlugin({ name: 'bundle.js', autoRestart: false }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
