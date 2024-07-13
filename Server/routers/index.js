const express = require("express");
const router = express.Router();
const { authentication } = require("../middlewares/authentication");

const { userCtrl } = require("../controllers/userCtrl");
const { eventCtrl } = require("../controllers/eventCtrl");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const { transactionCtrl } = require("../controllers/transactionCtrl");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

//II. Update payment status MIDTRANS
router.post("/payment/notification", transactionCtrl.paymentNotification); 

router.use(authentication);

router.get("/allEvent", eventCtrl.listEvent);
router.get("/allEvent/:id", eventCtrl.listEventById);
router.get("/event", eventCtrl.findEventsByRadius);
router.post("/event", eventCtrl.createFreeEvent) 

router.get("/categories", categoryCtrl.getCategory);

// router.get("/user/:id", userCtrl.findUserById);
router.get("/currentUser", userCtrl.findLoginUser);

router.get("/transactions", transactionCtrl.findAll);
// router.get("/transactions/:id", transactionCtrl.findById);
router.post('/payment/free-event/:eventId', transactionCtrl.freeEvent) 
//midtrans
//I. Initiate Order
router.post("/payment/midtrans/initiate/:eventId", transactionCtrl.initiateMidtransTrx);

//II. Update payment status
// router.patch("/payment/midtrans/success/event/:eventId", transactionCtrl.updatePaymentStatus);

module.exports = router;
