const UserModel = require("../models/user-model");
const MethodNotAllowed = require("../../errors/method-not-allowed-exception");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UserService {
  constructor() {}

  async createUser(body) {
    const { name, phone, email, password, passwordConfirm } = body;
    if (password != passwordConfirm)
      throw new MethodNotAllowed("confirm password");

    // check existience
    const userExist = await UserModel.findOne({ email });
    if (userExist)
      throw new MethodNotAllowed(`${userExist.email} already exist`);

    const user = await UserModel.create({ name, phone, email, password });
    return user;

    /*
    // create token
    const token = jwt.sign(
      { name, phone, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "15m" }
    );

    // create mail message object
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Accoun Activation Link`,
      html: `<h1>please use the activation link to activate your account </h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p> 
      `,
    };
    // send email
    sgMail
      .send(emailData)
      .then((sent) => {
        return `email has been sent  to ${email}, please verify your email`;
      })
      .catch((err) => {
        throw new MethodNotAllowed(err.message);
      });
      */
  }

  async accountActivationHandler(body) {
    const { token } = body;

    //check token
    if (!token) throw new MethodNotAllowed("token missing");
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
      const { name, phone, email, password } = decoded;

      // saving user
      const user = await UserModel.create({ name, phone, email, password });
      return user;
    } catch (error) {
      throw new Forbidden("Expired Token");
    }
  }
  async login(email, password) {
    //check email and also select password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) throw new MethodNotAllowed("Invalud user credentials");

    //check password

    if (
      !(await user.isCorrectPassword({
        requestPassword: password,
        savedPassword: user.password,
      }))
    )
      throw new MethodNotAllowed("Invalid user credentials");

    // return

    return { ...user._doc, password: undefined, passwordResetToken: undefined };
  }

  async getUserData(id) {
    //check userById existence
    const user = await UserModel.findById(id);
    if (!user) throw new MethodNotAllowed(`${id} is not exist`);

    // if exist return it
    user.passwordResetToken = undefined;
    return user;
  }

  async updateUserProfile(body, id) {
    const { name, phone, password } = body;

    //check user Exitience before update data using req.user
    const user = await UserModel.findById(id).select("+password");
    if (!user) throw new MethodNotAllowed("user does not exist");

    // then if exist update user data
    if (password) {
      user.password = password;
    }
    user.name = name;
    user.phone = phone;

    await user.save();

    return { ...user._doc, password: undefined, passwordResetToken: undefined };
  }
  async forgotPassword(body) {
    const { email } = body.email;
    //checking if user is within our system
    const user = await UserModel.findOne({ email });
    if (!user) throw new MethodNotAllowed("email does not exist in our system");

    //generate resetToken
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "15m",
      }
    );

    // create mail message which will be sent..
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    //check user ById and then update the resetToken in database
    const updateUserToken = await UserModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
    });
    if (!updateUserToken) throw new MethodNotAllowed("error ..");

    // send emial
    const sentEmail = await sgMail.send(emailData);
    if (!sentEmail) throw new MethodNotAllowed("error sending ..");

    return `Email has been sent to ${body.email}. Follow the instruction to activate your account`;
  }

  async resetPassword(body) {
    const { passwordResetToken, newPassword } = body;
    //check password
    if (!passwordResetToken) {
      throw new Forbidden("A token is required for authentication");
    }
    try {
      //reload payload from token into decoded
      const decoded = jwt.verify(
        passwordResetToken,
        process.env.JWT_RESET_PASSWORD
      );

      /*
      // adding payload {id,isAdmin} into request.user object
      const _id = decoded._id;
      //check user
      const user = await UserModel.findById(_id);
      if (!user) throw new MethodNotAllowed("user does not exist");
*/
      // chech token with user
      let userExits = await UserModel.findOne({
        passwordResetToken,
      });
      if (!userExits) throw new MethodNotAllowed("user token does not exists");

      // esle update user Password and resetToken
      const updatedFields = {
        password: newPassword,
        passwordResetToken: "",
      };

      userExits = _.extend(userExits, updatedFields);

      const resultUser = userExits.save();
      if (!resultUser)
        throw new MethodNotAllowed("Error resetting user password");

      return resultUser;
    } catch (err) {
      throw new Forbidden("Invalid Token");
    }
  }
}

module.exports = UserService;
