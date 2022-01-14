const AbstractError = require('./abstract-error')

/**
 * @example throw new Forbidden('Invalid token')
 */
class Forbidden extends AbstractError {
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'Forbidden'
    this.statusCode = 403
  }
}

module.exports = Forbidden
