const AbstractError = require('./abstract-error')

/**
 * @example throw new Unauthorized('There is no user with this id')
 */
class UnAuthorized extends AbstractError {
  constructor(message = 'UnAuthorized') {
    super(message)
    this.name = 'UnAuthorized'
    this.statusCode = 401
  }
}

module.exports = UnAuthorized
