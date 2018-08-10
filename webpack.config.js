var path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tfjs-vis.umd.js',
    libraryTarget: 'umd',
    library: 'tfvis',
  },
  externals: {
    '@tensorflow/tfjs': 'tf',
  }
};
