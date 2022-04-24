const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api.v1");

const app = express();

app.use(cors({ origin: "http://localhost:3060" }));

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(__dirname, "..", "public", "index.html");
});

module.exports = app;
