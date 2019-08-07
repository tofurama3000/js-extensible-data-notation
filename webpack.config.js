const path = require('path');

module.exports = [{
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: [/node_modules/, /\.spec\.tsx?$/]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'js-edn.browser.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Edn',
    libraryTarget: 'window'
  },
  devtool: 'inline-source-map'
}, {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: [/node_modules/, /\.spec\.tsx?$/]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'js-edn.node.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Edn',
    libraryTarget: 'umd'
  },
  devtool: 'inline-source-map'
}];
