if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { eventCtrl } = require("./controllers/eventCtrl");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routers"));
// app.get("/", (req, res) => {
//   res.json("halo");
// });

module.exports = app;
