"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Category, { foreignKey: "CategoryId" });
      Event.hasMany(models.Transaction, { foreignKey: "EventId" });
    }
  }
  Event.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "name cannot be empty",
          },
          notNull: {
            msg: "name cannot be empty",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "imageUrl cannot be empty",
          },
          notNull: {
            msg: "imageUrl cannot be empty",
          },
        },
      },
      location: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
        validate: {},
      },
      CategoryId: DataTypes.INTEGER,
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "eventDate cannot be empty",
          },
          notNull: {
            msg: "eventDate cannot be empty",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "quantity cannot be empty",
          },
          notNull: {
            msg: "quantity cannot be empty",
          },
        },
      },
      isFree: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
