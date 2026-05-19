const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "5d",
  });
};

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN || 5) * 24 * 60 * 60 * 1000
    ),
  };
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // strip password from response payload
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpire;

  res
    .status(statusCode)
    .cookie("token", token, getCookieOptions())
    .json({ success: true, token, user: safeUser });
};

module.exports = createSendToken;
module.exports.getCookieOptions = getCookieOptions;
