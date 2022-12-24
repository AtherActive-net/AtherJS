const path = require('path');

module.exports = {
  entry: './dist/app.js',
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'ather.js',
    globalObject: 'this',
    library: 'AtherJS',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
};