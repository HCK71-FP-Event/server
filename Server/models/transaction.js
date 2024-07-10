"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: "UserId" });
      Transaction.belongsTo(models.Event, { foreignKey: "EventId" });
    }
  }
  Transaction.init(
    {
      OrderId: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      EventId: DataTypes.INTEGER,
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Quantity cannot be 0'
          },
          notNull: {
            msg: "Quantity cannot be 0"
          }
        }
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
