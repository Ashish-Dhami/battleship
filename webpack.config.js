import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default (_, argv) => ({
  mode: argv.mode || 'development',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
      Assets: path.resolve(import.meta.dirname, 'assets'),
      Components: path.resolve(import.meta.dirname, 'src/components'),
      Services: path.resolve(import.meta.dirname, 'src/services'),
    },
    extensions: ['.js', '...'],
    mainFiles: ['index'],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  devtool: 'source-map',
  devServer: {
    watchFiles: ['./src/index.html'],
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
      {
        test: /\.(png|jpg|svg|jpeg)$/i,
        type: 'asset/resource',
      },
    ],
  },
})
