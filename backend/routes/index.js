const Router = require("express").Router();
const infoRouter = require("./info");
const userRouter = require("./user");

Router.use("/info", infoRouter);
Router.use("/user", userRouter);

module.exports = Router;
