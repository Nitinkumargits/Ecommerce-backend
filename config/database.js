const mongoose = require("mongoose");

//Connect Database
const connectDatabase = () => {
  const DB = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);

  mongoose
    .connect(DB)
    .then((data) =>
      console.log(
        `DB connection succesfull with server 💾💽💽💽💽💽💾 : ${data.connection.host} `
      )
    )
    .catch((err) => console.log(err));
};

module.exports = connectDatabase;
