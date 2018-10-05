process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const environment = require('./environment')
const sourceMap =  require('./loaders/source-map')

environment.loaders.append('source-map', sourceMap)

module.exports = environment.toWebpackConfig()
