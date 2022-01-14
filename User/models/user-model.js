const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");

// user
const userSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, select: false, trim: true },

  passwordResetToken: { data: String, default: "" },
});
// pre(action,callback) eventListener that called in callStack when event/action is raised in NODE ENVIRONMENT
// in our app:- saving document event is raised node environment
// can be used for many things before saving this
// first step for authentication {"encrypting password in database"}
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
  this.passwordConfirm = undefined;
  next();
});

// instance Method compare request(password) with savedPassword by decrypting savedPassword
// return true if savedPassword decrypted else false
userSchema.methods.isCorrectPassword = async function ({
  requestPassword,
  savedPassword,
}) {
  return await bcrypt.compare(requestPassword, savedPassword);
};

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;
