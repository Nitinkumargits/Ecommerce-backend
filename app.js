const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const errorhandler = require("./utils/errorhandler");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB binary file
      fieldSize: 15 * 1024 * 1024, // 15 MB — base64 strings inflate ~1.33x
    },
    abortOnLimit: true,
    responseOnLimit: "File too large. Max size is 10MB.",
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-nitin.ved.yt",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// ✅ Serve frontend **only in production**
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// ❌ Catch-all for undefined API routes
app.all("*", (req, res, next) => {
  next(new errorhandler(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
