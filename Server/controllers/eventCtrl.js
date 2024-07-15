const { sequelize } = require("../models");
const { Event, Category } = require(`../models/index`);
const { search, options } = require("../routers");
const { Sequelize } = sequelize;
const { Op, where } = require("sequelize");

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
      const { search } = req.query;
      const { filter } = req.query;
      let option = {
        include: {
          model: Category,
        },
      };

      if (filter) {
        option.include.where = {
          name: { [Op.iLike]: `%${filter}%` },
        };
      }
      if (search) {
        option.where = {
          name: { [Op.iLike]: `%${search}%` },
        };
      }

      console.log(filter);

      let allEvent = await Event.findAll(option);

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

  static async createFreeEvent(req, res, next) {
    try {
      const { long, lat, name, imageUrl, CategoryId, eventDate, quantity, description } = req.body;
      const locationConvert = Sequelize.fn("ST_GeomFromText", `POINT(${long} ${lat})`);
      let result = await Event.create({
        name,
        imageUrl,
        location: locationConvert,
        CategoryId,
        eventDate,
        quantity,
        isFree: true,
        price: 0,
        description,
      });
      console.log(result);
      res.status(201).json({ message: `event ${result.name} created!` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { eventCtrl };
