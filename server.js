require("dotenv/config");

const express = require("express");
const app = express();

require("./loaders/index")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`Listening on PORT ${PORT} ...`);
});
