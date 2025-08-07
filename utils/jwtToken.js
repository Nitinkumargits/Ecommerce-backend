const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// const catchAsync = require("../utils/catchAsync");
// const User = require("./../model/userModel");
// const AppError = require("./../utils/appError");
// const Email = require("./../utils/email");

// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken();

//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   // options.secure = req.secure || req.headers["x-forwarded-proto"] === "https";

//   res.cookie("token", token, options);

//   res.status(statusCode).json({
//     success: true,
//     token,
//     user,
//   });
// };

// module.exports = sendToken;

// Create Token and saving in cookie

// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken();

//   // options for cookie
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   res.status(statusCode).cookie("token", token, options).json({
//     success: true,
//     user,
//     token,
//   });
// };

// module.exports = sendToken;
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    // secure: true, // cookie will only be sent on an encrypted connection(https)
    httpOnly: true, // cookie can't be modified by the browser
  };

  cookieOptions.secure =
    req.secure || req.headers["x-forwarded-proto"] === "https";

  res.cookie("jwt", token, cookieOptions);

  // Removes the password from output
  // eslint-disable-next-line no-param-reassign
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
};

module.exports = createSendToken;
