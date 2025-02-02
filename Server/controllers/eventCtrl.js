const { sequelize } = require("../models");
const { Event, Category, User } = require(`../models/index`);
const { search, options, use } = require("../routers");
const { Sequelize } = sequelize;
const { Op, where } = require("sequelize");

class eventCtrl {
  static async findEventsByRadius(req, res, next) {
    try {
      const distance = req.query.distance || 5000;
      const lat = req.query.lat || "-6.254018391520317";
      const long = req.query.long || "106.7817000598548";

      const result = await sequelize.query(
        `select e.*, 
        jsonb_build_object('name', c.name) AS "Category"
        from "Events" e
        JOIN 
        "Categories" c ON e."CategoryId" = c.id
        where ST_DWithin(e.location,
                ST_MakePoint(:long, :lat),
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

      let user = await User.findByPk(req.user.id, {
        attributes: {
          exclude: ["password"],
        },
      });
      console.log(user);

      if (!eventById) {
        throw { name: "notFound" };
      } else {
        res.status(200).json({ eventById, user });
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
	UserId: req.user.id
      });
      res.status(201).json({ message: `event ${result.name} created!` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { eventCtrl };
