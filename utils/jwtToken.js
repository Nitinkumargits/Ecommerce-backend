const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "5d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  console.log("createSendToken :", token);

  // options for cookie
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ success: true, token, user });
};

module.exports = createSendToken;
