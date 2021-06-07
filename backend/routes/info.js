const Router = require("express").Router();
const infoController = require("../controllers/infoController");

Router.get("/scrape", infoController.scrape);
Router.get("/all_data", infoController.sendClient);

module.exports = Router;
