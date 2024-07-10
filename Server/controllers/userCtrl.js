const { User } = require("../models/index");
const { comparePass } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jsonwebtoken");

class userCtrl {
  static async register(req, res, next) {
    try {
      const {
        email,
        password,
        fullName,
        birthOfDate,
        phoneNumber,
        address,
        avatar,
      } = req.body;

      if (!email) throw { name: "Email Empty" };
      if (!password) throw { name: "Password Empty" };
      if (!fullName) throw { name: "fullName Empty" };
      if (!birthOfDate) throw { name: "birthOfDate Empty" };
      if (!phoneNumber) throw { name: "phoneNumber Empty" };
      if (!address) throw { name: "address Empty" };

      let user = await User.create({
        email,
        password,
        fullName,
        birthOfDate,
        phoneNumber,
        address,
        avatar,
      });

      res.status(201).json({
        message: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: "Email Empty" };
      if (!password) throw { name: "Password Empty" };

      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: "Invalid Login" };

      const result = comparePass(password, user.password);
      if (!result) throw { name: "Invalid Login" };

      const token = createToken({ id: user.id });
      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { userCtrl };
