const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

/*
    // exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    //   const { token } = req.cookies;
    //   console.log("isAuth :", token);

    //   if (!token) {
    //     return next(new ErrorHander("Please Login to access this resource", 401));
    //   }

    //   const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    //   req.user = await User.findById(decodedData.id);

    //   next();
    // });

    // exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    //   console.log("Cookies received:", req.cookies); // Add this
    //   const { token } = req.cookies;

    //   if (!token) {
    //     console.log("No token found in cookies");
    //     return next(new ErrorHander("Please Login to access this resource", 401));
    //   }

    //   const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = await User.findById(decodedData.id);

    //   next();
    // });

    // exports.isAuthenticatedUser = async (req, res, next) => {
    //   const { token } = req.cookies || req.headers;

    //   if (!token || !token.startsWith("Bearer ")) {
    //     return res.status(401).json({
    //       success: false,
    //       message: "Please Login to access this resource",
    //     });
    //   }

    //   try {
    //     const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    //     req.user = await User.findById(decoded.id);
    //     next();
    //   } catch (error) {
    //     return res.status(401).json({
    //       success: false,
    //       message: "Invalid token, please login again",
    //     });
    //   }
    // };


  // exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //   const { token } = req.cookies;

  //   console.log("getting token before /me route :", token);

  //   if (!token) {
  //     return next(new ErrorHander("Please Login to access this resource", 401));
  //   }

  //   const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  //   req.user = await User.findById(decodedData.id);

  //   next();
  // });


*/
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // 1> Getting token and check for token if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //condition which we want save the token
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2> Validate/Verification the token(JWT algo verifiy , signature is valid or not, or token is expires,if someone manipulated the data)

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3>check if  User is still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4> check if user change password if after the JWT/token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently change password ! Please login again ", 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
