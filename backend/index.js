const express = require("express");
const app = require("./app");
const mongoose = require("mongoose");
const PORT = 8080;
const url = "mongodb://127.0.0.1:27017/scraperdb";

app.listen(PORT, () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Successfully connected to mongodb");
    })
    .catch(() => {
      console.log("Error connecting to db");
    });

  console.log(`listening on port ${PORT}`);
});
