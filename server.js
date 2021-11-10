const express = require("express");
const app = require("./routes/index");
const mongoose = require("./helpers/db");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });



server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//promise methods
//node mailer
