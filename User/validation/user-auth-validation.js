const { check, param } = require("express-validator");
const ErrorHandler = require("../../middlewares/handle-express-validator-error");
const userRegisterValidation = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("enter full name")
    .bail()
    .matches(
      /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){0,2024}$/
    )
    .withMessage("enter valid data"),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("enter phone number")
    .bail()
    .isString()
    .withMessage("enter valid phone number"),
  check("email").isEmail().withMessage("enter valid email"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("enter password")
    .bail()
    .isLength({ min: 8 }),
  ErrorHandler,
];
const userLoginValidation = [
  check("email").isEmail().withMessage("enter valid email"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("enter password")
    .bail()
    .isLength({ min: 8 }),
  ErrorHandler,
];
const userIdValidation = [
  param("id").isMongoId().withMessage("invalid user id"),
];
const updateUserValidation = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("enter full name")
    .bail()
    .matches(
      /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){0,2024}$/
    )
    .withMessage("enter valid data"),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("enter phone number")
    .bail()
    .isString()
    .withMessage("enter valid phone number"),
  ErrorHandler,
];

const forgotPasswordValidation = [
  check("email").trim().not().isEmpty().withMessage("enter email"),
  ErrorHandler,
];
const resetPasswordValidation = [
  check("passwordResetToken")
    .trim()
    .not()
    .isEmpty()
    .withMessage("reset password token is missed"),
  check("newPassword")
    .not()
    .isEmpty()
    .withMessage("enter password")
    .bail()
    .isLength({ min: 8 }),
  ErrorHandler,
];

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  userIdValidation,
  updateUserValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
