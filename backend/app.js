const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes/");
// const cron = require("node-cron");
// const scraperFunction = require("./controllers/infoController").getAll;

app.use("/api", api);
app.use(express.json());
app.use(cors());

// const scrapeTask = cron.schedule("*/2 * * * *", scraperFunction, {
//   scheduled: false,
// });

// scrapeTask.start();

module.exports = app;
