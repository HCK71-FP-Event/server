const express = require("express");
const router = express.Router();
const { authentication } = require("../middlewares/authentication");

const { userCtrl } = require("../controllers/userCtrl");
const { eventCtrl } = require("../controllers/eventCtrl");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const { transactionCtrl } = require("../controllers/transactionCtrl");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

router.use(authentication);

router.get("/allEvent", eventCtrl.listEvent);
router.get("/allEvent/:id", eventCtrl.listEventById);
router.get("/event", eventCtrl.findEventsByRadius);

router.get("/categories", categoryCtrl.getCategory);

router.get("/user/:id", userCtrl.findUserById);

router.get("/transactions", transactionCtrl.findAll);
router.get("/transactions/:id", transactionCtrl.findById);
//midtrans
//I. Initiate Order
router.get('/payment/midtrans/initiate', transactionCtrl.initiateMidtransTrx)

module.exports = router;
