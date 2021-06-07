const Router = require("express").Router();
const userController = require("../controllers/userController");

Router.post("/new", userController.postUser);
Router.put("/update_keywords", userController.changeKeywords);
Router.put("/update_interval", userController.changeInterval);

module.exports = Router;
