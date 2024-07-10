const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
const { User, Transaction, Event } = require("../models/index");

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
      let { eventId } = req.params;
      let { quantity } = req.body;

      let event = await Event.findByPk(eventId);
      let user = await User.findByPk(req.user.id);
      console.log(quantity, event.quantity);

      //event availability checker
      if (!event) {
        throw { name: "notFound" };
      }

      //event ticket availability checker
      if (quantity > event.quantity) {
        throw { name: "outOfStock" };
      }

      // Create Snap API instance
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        //data detail order
        transaction_details: {
          order_id: `TRX_ID_${uuidv4()}`,
          gross_amount: quantity * event.price,
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
      console.log(transaction);
      let transactionToken = transaction.token;

      //   III. Create order in DB
      await Transaction.create({
        OrderId: parameter.transaction_details.order_id,
        amount: parameter.transaction_details.gross_amount,
        status: "Pending",
        UserId: req.user.id,
        EventId: eventId,
        quantity: quantity,
        //transactionToken boleh disimpen (opsional), supaya ketika pembayaran pending, token bisa dikirim kembali ke user
      });

      res.json({ message: "Order created", transactionToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { transactionCtrl };
