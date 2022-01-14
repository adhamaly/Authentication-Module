const { validationResult } = require('express-validator')
const MethodNotAllowed = require('./../errors/method-not-allowed-exception')

module.exports = function handleExpressValidatorError(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new MethodNotAllowed(errors.array())
  } else {
    next()
  }
}
