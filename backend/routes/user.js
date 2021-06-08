const Router = require("express").Router();
const userController = require("../controllers/userController");

Router.post("/new", userController.postUser);
Router.post("/exist", userController.doesExist);
Router.put("/update_keywords", userController.changeKeywords);
Router.put("/update_interval", userController.changeInterval);
Router.post("/get_user", userController.getUser);

module.exports = Router;
