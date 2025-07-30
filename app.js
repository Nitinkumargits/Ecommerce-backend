const express = require("express");
require("dotenv").config({ path: "backend/config/config.env" });
const app = express();
const cookieParser = require("cookie-parser");
const errorhander = require("./utils/errorhandler");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.options("*", cors()); //for all routes

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

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
  next(new errorhander(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
