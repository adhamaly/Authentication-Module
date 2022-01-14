const { body } = require('express-validator')

exports.defaultStringValidation = ({ name, min = 8, max = 255 }) =>
  body(name)
    .isString()
    .bail()
    .isLength({ min, max })
    .withMessage(`Password length must be between ${min} and ${max} characters`)
