const Router = require("express").Router();
const infoController = require("../controllers/infoController");

Router.get("/test", infoController.getAll);

module.exports = Router;
