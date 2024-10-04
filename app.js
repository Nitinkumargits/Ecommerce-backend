const express = require("express");
require("dotenv").config({ path: "backend/config/config.env" });
const app = express();
const cookieParser = require("cookie-parser");
const errorhander = require("./utils/errorhander");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handling undefined routes
app.all("*", (req, res, next) => {
  next(new errorhander(`Can't find ${req.originalUrl} on this server`, 404));
});

/** Global Error handling Middleware */
app.use(errorMiddleware);

module.exports = app;
