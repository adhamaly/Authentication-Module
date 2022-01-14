const mongoose = require("mongoose");

module.exports = () => {
  const DB = process.env.DB_DEV;
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.info("Connected to MongoDB..."))
    .catch((err) => console.error(`Couldn't connect to MongoDB... `, err));
};
