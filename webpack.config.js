module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json']
  },
  module: {
    loaders: [
      { test: /\.ts|\.tsx$/, loader: 'ts-loader' }
    ]
  }
}
