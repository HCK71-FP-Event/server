const { sequelize } = require("../models");

class eventCtrl {
  static async findEventsByRadius(req, res) {
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
      res.status(500).json(error);
    }
  }
}

module.exports = { eventCtrl };
