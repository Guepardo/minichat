const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'css/app.css',
})

function sassRules () {
  return [
    {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
    }
  ]
}

function scriptRules () {
  return [
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'babel-loader',
      options: { presets: ['@babel/env'] }
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss',
    './resources/assets/scripts/app.js'
  ],
  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: sassRules().concat(scriptRules())
  },
  plugins: [
    extractSass
  ]
}