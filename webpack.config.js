
module.exports = {
  entry: './src/app.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },
};
