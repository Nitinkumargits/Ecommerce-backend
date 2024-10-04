const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary").v2;

const cors = require("cors");
app.use(cors());

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Config
dotenv.config();

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
