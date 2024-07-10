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
}

module.exports = { transactionCtrl };
