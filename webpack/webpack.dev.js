const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  stats: 'errors-warnings',
  devtool: 'eval',
  output: {
    assetModuleFilename: "feh/[name][ext]"
  },
  devServer: {
    open: true
  }
}

module.exports = merge(common, dev)
