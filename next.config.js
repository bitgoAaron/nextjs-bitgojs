/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

/** @type { import('webpack').Configuration } */
const bitgoConfig = {
  resolve: {
    alias: {
      // this is only required if using bitgo instead of just the sdk-api
      '@hashgraph/sdk': path.resolve(
        'node_modules/@hashgraph/sdk/src/browser.js'
      ),
      'superagent-proxy': false,
      // use the default version here since we're webpacking ourselves
      '@bitgo/sdk-api': path.resolve(
        'node_modules/@bitgo/sdk-api/dist/src/index.js'
      ),
      async: path.resolve('node_modules/async/index.js'),
    },
    fallback: {
      constants: false,
      crypto: require.resolve('crypto-browserify'),
      dns: false,
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      http2: require.resolve('stream-http'),
      net: false,
      os: false,
      path: false,
      stream: require.resolve('stream-browserify'),
      tls: false,
      url: require.resolve('url/'),
      vm: false,
      zlib: false,
      async: require.resolve('async'),
    },
  },
  externals: ['morgan', 'superagent-proxy'],
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

    new webpack.NormalModuleReplacementPlugin(
      /@emurgo\/cardano-serialization-lib-nodejs/,
      '@emurgo/cardano-serialization-lib-browser'
    ),

    new webpack.ContextReplacementPlugin(/cardano-serialization-lib-browser/),
  ],
  node: {
    global: true,
  },
  experiments: {
    backCompat: false,
    asyncWebAssembly: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          warnings: true,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  webpack: (config) => {
    return merge(config, bitgoConfig);
  },
};

module.exports = nextConfig;
