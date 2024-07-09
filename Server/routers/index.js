const express = require("express");
const router = express.Router();

const { userCtrl } = require("../controllers/userCtrl");
const { eventCtrl } = require("../controllers/eventCtrl");


router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/event", eventCtrl.findEventsByRadius);

module.exports = router;
