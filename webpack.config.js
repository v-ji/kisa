const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new FaviconsWebpackPlugin({
      logo: './src/icons/logo.png',
      favicons: {
        appName: 'Kisa News',
        developerURL: null, // prevent retrieving from the nearest package.json
        start_url: '/',
        background: '#fff',
        theme_color: '#000',
        lang: 'en_GB',
        display: 'browser',
        icons: {
          firefox: false,
          coast: false,
          yandex: false
        }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    https: true
  }
}
