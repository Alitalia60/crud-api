const path = require('path');

module.exports = {
  entry: './src/app.ts',
  mode: 'development',
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js', '.webpack.js', '.web.js']
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  }
};