const AbstractError = require('./abstract-error')

/**
 * @example throw new NotFoundException('There is no user with this id')
 */
class NotFound extends AbstractError {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFound'
    this.statusCode = 404
  }
}

module.exports = NotFound
