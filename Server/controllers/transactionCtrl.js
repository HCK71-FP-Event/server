const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
const { User, Transaction, Event } = require("../models/index");

class transactionCtrl {
  static async findAll(req, res, next) {
    try {
      let result = await Transaction.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
        where: {
          UserId: req.user.id,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      let { id } = req.params;
      let result = await Transaction.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },

          {
            model: Event,
          },
        ],
      });
      res.status(200).json({
        OrderId: result.OrderId,
        name: result.User.fullName,
        phoneNumber: result.User.phoneNumber,
        email: result.User.email,
        event: result.Event.name,
        eventDate: result.Event.eventDate,
        status: result.status,
        grandTotal: result.amount,
      });
    } catch (error) {
      next(error);
    }
  }

  //menerima eventId dari params dan quantity ticket dari req.body
  static async freeEvent(req, res, next) {
    try {
      const { eventId } = req.params;
      const { quantity } = req.body;
      const event = await Event.findByPk(eventId);
      //check event is available
      if (!event) {
        throw { name: "notFound" };
      }

      const user = await User.findOne({
        id: event.UserId,
      });

      //check event ticket is available
      if (quantity > event.quantity) {
        throw { name: "outOfStock" };
      }

      await Transaction.create({
        OrderId: `FREE-${uuidv4()}`,
        quantity: quantity,
        amount: 0,
        status: "Paid",
        UserId: req.user.id,
        EventId: eventId,
      });

      let quantityUpdated = event.quantity - quantity;

      await event.update({
        quantity: quantityUpdated,
      });
      res.status(201).json({
        message: `Order created!`,
        detailOrder: {
          fullName: user.fullName,
          // eventDate: String(event.eventDate).slice(0, 10),
          eventDate: String(event.eventDate),
          quantity: quantity,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  //menerima eventId dari params dan quantity ticket dari req.body
  static async initiateMidtransTrx(req, res, next) {
    try {
      let { eventId } = req.params;
      let { quantity } = req.body;

      let event = await Event.findByPk(eventId);
      //event availability checker
      if (!event) {
        throw { name: "notFound" };
      }

      let user = await User.findByPk(req.user.id);

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
          order_id: uuidv4(),

          gross_amount: quantity * event.price,
        },

        //data jenis pembayaran
        credit_card: {
          secure: true,
        },
        //data detail customer
        customer_details: {
          first_name: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
          billing_address: { address: user.address },
          age: new Date().getFullYear() - Number(user.birthOfDate.slice(6, 10)),
        },
      };

      //II. Create transaction to midtrans
      const transaction = await snap.createTransaction(parameter);
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

      res.json({ message: "Order created", token: transactionToken, redirect_url: transaction.redirect_url });
    } catch (error) {
      next(error);
    }
  }

  // static async updatePaymentStatus(req, res, next) {
  //   try {
  //     const { eventId } = req.params;
  //     const { OrderId } = req.body;
  //     console.log(OrderId);
  //     console.log(eventId);

  //     //transaction checker
  //     const transaction = await Transaction.findOne({
  //       where: {
  //         OrderId,
  //       },
  //     });
  //     if (!transaction) {
  //       throw { name: "notFound" };
  //     }

  //     const event = await Event.findOne({
  //       where: {
  //         id: eventId,
  //       },
  //     });
  //     if (!event) {
  //       throw { name: "notFound" };
  //     }

  //     // const serverKey = process.env.MIDTRANS_SERVER_KEY;
  //     const serverKey = "SB-Mid-server-FHY9yP5924-6a69eM5AT0rHB";
  //     const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");

  //     // console.log(transaction);

  //     const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
  //       headers: {
  //         Authorization: `Basic ${base64ServerKey}`,
  //       },
  //     });
  //     if (response.data.transaction_status === "capture" && response.data.status_code === "200") {
  //       //kurangin quantity tiket event ...
  //       await transaction.update({ status: "Paid" });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async paymentNotification(req, res) {
    // console.log(req.body);
    const { transaction_status } = req.body;
    const { status_code } = req.body;
    const { order_id } = req.body;

    const transaction = await Transaction.findOne({
      where: {
        OrderId: order_id,
      },
    });

    if (!transaction) {
      throw { name: "notFound" };
    }
    const quantityTicket = transaction.quantity;

    const event = await Event.findOne({
      id: transaction.EventId,
    });
    const quantityTicketEvent = event.quantity;

    if (transaction_status === "capture" && status_code === "200") {
      await transaction.update({ status: "Paid" });
      let quantityUpdated = quantityTicketEvent - quantityTicket;
      await event.update({ quantity: quantityUpdated });
    }
    res.status(200).json({ message: `${transaction.OrderId} transaction paid` });
  }
}

module.exports = { transactionCtrl };
