const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const extractToken = (req) => {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new ErrorHandler("Invalid or expired token. Please login again.", 401)
    );
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new ErrorHandler("The user belonging to this token no longer exists", 401)
    );
  }

  req.user = user;
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user ? req.user.role : "guest"} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
