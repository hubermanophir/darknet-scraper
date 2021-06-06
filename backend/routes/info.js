const Router = require("express").Router();
const infoController = require("../controllers/infoController");

Router.get("/scrape", infoController.getAll);
Router.get("/data", infoController.sendClient);

module.exports = Router;
