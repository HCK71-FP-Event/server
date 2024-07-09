'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {foreignKey: "UserId"})
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{
        args: true,
        msg: "Email already in use!"
      },
      validate:{
        notEmpty: {
          msg: "Email cannot be empty"
        },
        notNull: {
          msg: "Email cannot be empty"
        },
        isEmail: {
          msg: "Input must be in email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      notEmpty: {
        msg: "Password cannot be empty"
      },
      notNull: {
        msg: "Password cannot be empty"
      },
      len: {
        args: [5,20],
        msg: "Password min length is 5"
      }
    },
    fullName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "fullName cannot be empty"
        },
        notNull: {
          msg: "fullName cannot be empty"
        }
      }
    },
    birthOfDate: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "birthOfDate cannot be empty"
        },
        notNull: {
          msg: "birthOfDate cannot be empty"
        }
      }
    },
    phoneNumber: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "phoneNumber cannot be empty"
        },
        notNull: {
          msg: "phoneNumber cannot be empty"
        }
      }
    },
    address: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};