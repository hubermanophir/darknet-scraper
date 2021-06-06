const Router = require("express").Router();
const infoRouter = require("./info");

Router.use("/info", infoRouter);

module.exports = Router;
