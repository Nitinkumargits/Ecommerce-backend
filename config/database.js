const mongoose = require("mongoose");

//Connect Database
const connectDatabase = () => {
  const DB = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);

  mongoose
    .connect(DB, {
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(`DB connection succesfull : LocalHost 💾💽💽💽💽💽💾`)
    );
};

module.exports = connectDatabase;
