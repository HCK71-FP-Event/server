'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    CategoryId: DataTypes.INTEGER,
    eventDate: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    isFree: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};