const jwt = require("jsonwebtoken");
const MethodNotAllowed = require("../errors/method-not-allowed-exception");
const UnAuthorized = require("../errors/unauthorized-exception");
const Forbidden = require("../errors/forbidden-exception");

function createToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5h",
    }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7h",
    }
  );
}
function decodeRefreshToken(expectedRefreshToken) {
  if (!expectedRefreshToken) throw new MethodNotAllowed("Empty refresh token");
  try {
    return jwt.verify(expectedRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    throw new UnAuthorized("Refresh token is expired please make new sign in");
  }
}

function isAuthorized(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new Forbidden("A token is required for authentication");
  }
  try {
    //reload payload from token into decoded
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // adding payload {id,isAdmin} into request.user object
    req.user = decoded;
    console.log(req.user);
  } catch (err) {
    throw new Forbidden("Invalid Token");
  }
  return next();
}

function checkIdValidation(req, res, next) {
  let ObjectId = require("mongoose").Types.ObjectId;
  if (!ObjectId.isValid(req.params.id))
    throw new MethodNotAllowed("Invalid Id");
  next();
}
module.exports = {
  isAuthorized,
  decodeRefreshToken,
  createRefreshToken,
  createToken,
  checkIdValidation,
};
