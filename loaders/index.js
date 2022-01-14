const expressLoader = require('./express-loader')
const mongooseLoader = require('./mongoose-loader')

module.exports = app => {
  expressLoader(app)
  mongooseLoader()
}
