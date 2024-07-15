const { Transaction } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (transaction.UserId === req.user.id) {
      next();
    } else {
      throw { name: "Unauthorized" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authorization };
