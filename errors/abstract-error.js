class AbstractError extends Error {
  constructor(error, statusCode) {
    super()
    this.error = error
    this.name = 'AbstractError'
    this.statusCode = statusCode
  }

  /**
   * Serializes error message to be ready to be sent to the client
   *
   * @returns array of error messages [{message: 'error message', field: fieldName }, ...]
   */
  serializeErrors() {
    if (Array.isArray(this.error))
      return this.error.map(e => ({
        message: e.msg,
        ...(e.param && { field: e.param }),
      }))

    return [{ message: this.error.msg || this.error.message || this.error }]
  }
}

module.exports = AbstractError
