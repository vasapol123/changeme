import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import nodeExternals from 'webpack-node-externals';
import { Configuration as WebpackConfiguration } from 'webpack';

const config: WebpackConfiguration = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['npx nx run:dev api'],
      }
    }),
  ],
  externals: [nodeExternals()],
  resolve: {
    modules: ['./src', './node_modules'],
    extensions: ['.ts', '.js', '.cjs', '.mjs', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  stats: {
    colors: true,
  },
};
export default config;
