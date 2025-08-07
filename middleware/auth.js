const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2. Check if token exists
  if (!token) {
    return next(
      new ErrorHander(
        "You are not logged in! Please log in to get access.",
        401
      )
    );
  }

  // 3. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ErrorHander("The user belonging to this token no longer exists.", 401)
    );
  }

  // 5. Check if user changed password after token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new ErrorHander(
        "User recently changed password! Please login again.",
        401
      )
    );
  }

  // 6. Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
