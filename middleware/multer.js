// middleware/multer.js

const multer = require("multer");

// Memory storage — because we need the buffer to send to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
