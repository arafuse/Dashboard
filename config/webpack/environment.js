const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')
const style =  require('./loaders/style')

environment.config.set('resolve.extensions', ['.woff', '.woff2', '.eot', '.ttf', '.otf'])
environment.loaders.append('typescript', typescript)
environment.loaders.get('css').test = style.test
environment.loaders.get('css').use = style.use

module.exports = environment
