module.exports = {
  entry: './lib/reporter.js',
  target: 'node',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  output: {
    path: './build',
    filename: 'reporter.js',
    libraryTarget: 'commonjs2'
  }
}
