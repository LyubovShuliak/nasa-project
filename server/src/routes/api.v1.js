const app = require("express");
const planetRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = app.Router();

api.use("/planets", planetRouter);
api.use("/launches", launchesRouter);

module.exports = api;
