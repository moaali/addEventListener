import webpack from 'webpack';
import path from 'path';
import yargs from 'yargs';

const { env } = yargs.argv;
const { UglifyJsPlugin } = webpack.optimize;
const libraryName = 'addEventListener';
const plugins = [];

let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = `${libraryName}.min.js`;
} else {
  outputFile = `${libraryName}.js`;
}

const config = {
  entry: path.join(__dirname, '/src/index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(.jsx?)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(.jsx?)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src'),
    ],
    extensions: ['.json', '.js']
  },
  plugins,
};

export default config;
