const path = require('path');

module.exports = {
  entry: './src/app.ts',
  mode: 'production',
  target: 'node',
  // context: path.resolve(__dirname, 'crud-api'),
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