'use strict'

const IS_PROD = require('./src/server/is_prod')
const BASE_API_URL = IS_PROD ? '' : 'http://127.0.0.1:8081'

const getConfig = require('hjs-webpack')
const webpack = require('webpack')

let config = getConfig({
  in: 'src/client/index.js',
  out: 'public/',
  html: (context) => {
    return {
      'index.html': context.defaultTemplate({
        title: 'Micro Device Lab'
      })
    }
  }
})

config.plugins.push(new webpack.DefinePlugin({
  BASE_API_URL: JSON.stringify(BASE_API_URL),
  IS_PROD
}))

module.exports = config
