const express = require("express");
const { userCtrl } = require("../controllers/userCtrl");
const { eventCtrl } = require("../controllers/eventCtrl");

const router = express.Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/event", eventCtrl.findEventsByRadius);

module.exports = router;
