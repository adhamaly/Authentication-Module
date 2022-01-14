const AbstractError = require('./abstract-error')

/**
 * @example throw new MethodNotAllowed('There is no user with this id')
 */
class MethodNotAllowed extends AbstractError {
  constructor(message = 'Method not allowed') {
    super(message)
    this.name = 'MethodNotAllowed'
    this.statusCode = 405
  }
}

module.exports = MethodNotAllowed
