const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
const { userCtrl } = require("./userCtrl");
const { User, Transaction } = require("../models/index");

class transactionCtrl {
  static async findAll(req, res, next) {
    try {
      res.status(200).json({ message: "Find all transactions" });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      res.status(200).json({ message: "Find transaction by id" });
    } catch (error) {
      next(error);
    }
  }

  static async initiateMidtransTrx(req, res, next) {
    try {
      // Create Snap API instance
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });
      //   console.log(req.user.id);
      let user = await User.findByPk(req.user.id);
      //   console.log(user, "user>>>>");

      let parameter = {
        //data detail order
        transaction_details: {
          order_id: `TRX_ID_${uuidv4()}`,
          gross_amount: 10_000,
        },
        //data jenis pembayaran
        credit_card: {
          secure: true,
        },
        //data detail customer
        customer_details: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
          address: user.address,
          age: new Date().getFullYear() - Number(user.birthOfDate.slice(6, 10)),
        },
      };

      //II. Create transaction to midtrans
      const transaction = await snap.createTransaction(parameter);
      let transactionToken = transaction.token;

      //   III. Create order in DB
      await Transaction.create({
        OrderId: 0,
        amount: 0,
        status: "Paid",
        UserId: req.user.id,
        EventId: 1,
      });

      res.json({ message: "Order created", transactionToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { transactionCtrl };
