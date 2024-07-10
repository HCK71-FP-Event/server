const { sequelize } = require("../models");
const { Event, Category } = require(`../models/index`);

class eventCtrl {
  static async findEventsByRadius(req, res, next) {
    try {
      // distance on meter unit
      const distance = req.query.distance || 2000;
      const long = req.query.long || "-6.254018391520317";
      const lat = req.query.lat || "106.7817000598548";

      const result = await sequelize.query(
        `select * from
          "Events"
        where
          ST_DWithin(location,
          ST_MakePoint(:lat,
          :long),
          :distance,
        true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(long),
            lat: parseFloat(lat),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listEvent(req, res, next) {
    try {
      let allEvent = await Event.findAll({
        include: {
          model: Category,
        },
      });
      res.status(200).json({ allEvent });
    } catch (error) {
      next(error);
    }
  }

  static async listEventById(req, res, next) {
    try {
      let { id } = req.params;
      let eventById = await Event.findByPk(id, {
        include: [
          {
            model: Category,
          },
        ],
      });

      if (!eventById) {
        throw { name: "notFound" };
      } else {
        res.status(200).json({ eventById });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { eventCtrl };
