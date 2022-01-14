const router = require("express").Router();
// import UserService Class
const {
  userRegisterValidation,
  userLoginValidation,
  userIdValidation,
  updateUserValidation,
} = require("../validation/user-auth-validation");
const UserAuthenticationService = require("../service/user-authentication-service");
const userAuthService = new UserAuthenticationService();
const {
  createToken,
  createRefreshToken,
  isAuthorized,
} = require("../../middlewares/authentication");
const UserService = require("../service/user-authentication-service");

// apis..
router.post("/register", userRegisterValidation, registerHandler);
router.post("/accountActivation", accountActivationHandler);
router.post("/login", userLoginValidation, loginHandler);
router.post("/forgotPasswordd", ForgetPasswordHandler);
router.post("/resetPassword", resetPasswordHandler);

// GET request's
router.get("/profile/:id", isAuthorized, userIdValidation, userProfileHandler);
// patch API's
router.patch("/profile", isAuthorized, updateUserValidation, updateUserHandler);
// delete user account API
router.delete("/account/:id", isAuthorized, userIdValidation, deleteHandler);
//User Handler

async function registerHandler(req, res) {
  const result = await userAuthService.createUser(req.body);
  res.status(200).json({
    status: "success",
    message: result,
  });
}

async function accountActivationHandler(req, res) {
  const result = await userAuthService.accountActivationHandler(req.body);
  res.status(200).json({
    status: "success",
    message: result,
  });
}

async function loginHandler(req, res) {
  const { email, password } = req.body;
  const userLogined = await userAuthService.login(email, password);
  const token = createToken(userLogined);
  const refreshToken = createRefreshToken(userLogined);
  res.status(200).json({
    status: "success",
    user: {
      userLogined,
    },

    token: token,
    refreshToken: refreshToken,
  });
}

async function userProfileHandler(req, res) {
  const user = await userAuthService.getUserData(req.params.id);
  res.status(200).json({
    status: true,
    data: {
      userData: user,
    },
  });
}

async function updateUserHandler(req, res) {
  const user = await userAuthService.updateUserProfile(req.body, req.user._id);
  res.status(200).json({
    status: true,
    data: {
      user: user,
    },
  });
}

async function deleteHandler(req, res) {
  const deletedUser = await userAuthService.deleteAccount(req.params.id);
  res.status(200).json({
    status: true,
    data: {
      deleted: deletedUser,
    },
  });
}

async function ForgetPasswordHandler(req, res) {
  const result = await userAuthService.forgotPassword(req.body);
  res.status(200).json({
    status: "success",
    message: result,
  });
}

async function resetPasswordHandler(req, res) {
  const result = await userAuthService.resetPassword(req.body);
  res.status(200).json({
    status: "success",
    message: "password updating successfully",
    user: result,
  });
}

module.exports = router;
