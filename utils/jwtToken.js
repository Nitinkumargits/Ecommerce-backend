const jwt = require("jsonwebtoken");

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "5d",
  });
};

// Create and send token with cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN || 5) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  // res.cookie("token", token, cookieOptions); // ✅ "jwt" matches the middleware

  // res.status(statusCode).json({
  //   success: true,
  //   token,
  //   user,
  // });

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ success: true, user, token });
};

module.exports = createSendToken;
