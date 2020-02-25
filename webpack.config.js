const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const config = {
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
        start_url: '/kisa',
        background: '#000',
        theme_color: '#fff',
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
  devServer: {
    contentBase: './dist'
  }
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.output.publicPath = '/kisa'
  } else {
    config.output.publicPath = '/'
  }

  return config
}
