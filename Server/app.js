if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routers"));

module.exports = app;
