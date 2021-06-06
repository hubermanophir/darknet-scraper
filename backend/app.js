const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes/");

app.use("/api", api);
app.use(express.json());
app.use(cors());

module.exports = app;
