const dotenv = require("dotenv");
// Load env first so any module using process.env reads correct values
dotenv.config();
const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary").v2;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://ecommerce-nitin.ved.yt",
].concat(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next();
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ error: "Not allowed by CORS" });
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// Config already loaded above

// Database connection
connectDatabase();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(
    "Shutting down the server due to Unhandled Promise Rejection 🔻🔻🔻"
  );

  server.close(() => {
    process.exit(1);
  });
});
