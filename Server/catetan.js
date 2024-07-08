// bikin model :
// npx sequelize-cli model:create --name Grocery --attributes title:string,price:integer,tag:string,imageUrl:string,UserId:integer

// bikin seed :
// npx sequelize-cli seed:create --name nama_seed

// create db :
// npx sequelize-cli db:create

// migrate db :
// npx sequelize-cli db:migrate

// seed db :
// npx sequelize-cli db:seed:all

// Step:
// npm init -y
// npm install jest supertest express pg sequelize sequelize-cli nodemon bcryptjs jsonwebtoken
// sequelize init + create folder
// setting config
// create model
// setup model + migration
// 6.5. create db, migration + seed (optional)
// setup helpers
// 7.5. create router + controllers
// create app.js + bin/www
// body parser => urlencoded dan json
// listing route
// setup middleware + error handler
// kerja

// How to run test :
// asdasdasd npx sequelize-cli db:create --env test

// migrate db :
// asdagasdasd npx sequelize-cli db:migrate --env test

// run this command npx jest --detectOpenHandles --forceExit --verbose

// npx sequelize-cli model:create --name User --attributes email:string,password:string,fullName:string,birthOfDate:string,phoneNumber:string,address:string,balance:integer,role:string
//  npx sequelize-cli model:create --name Transaction --attributes orderId:integer,amount:integer,isPay:boolean,UserId:integer,EventId:integer
// npx sequelize-cli model:create --name Event --attributes name:string,imageUrl:string,eventDate:date,CategoryId:integer
// npx sequelize-cli model:create --name Category --attributes name:string

//kiwkiwkiw


// -- model user 
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     email: {
//      type: DataTypes.STRING,
//      allowNull:false,
//      unique: {
//       args: true,
//       msg: "Email is already in use!"
//      },
//      validate: {
//       notEmpty: {
//         msg: "Email cannot be empty"
//       },
//       notNull: {
//         msg: "Email cannot be empty"
//       },
//       isEmail: {
//         msg: "Input must be in email format"
//       }
//      }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//       validate: {
//         notEmpty: {
//           msg: "Password cannot be empty"
//         }, 
//         notNull: {
//           msg: "Password cannot be empty"
//         },
//         len: {
//           args: [5,20],
//           msg: "Password min length is 5 "
//         }
//       }
//     },
//     fullName: {
//       type:DataTypes.STRING,
//       allowNull:false,
//       validate: {
//         notEmpty: {
//           msg: "fullName cannot be empty"
//         },
//         notNull: {
//           msg: "fullName cannot be empty"
//         }
//       }
//     },
//     birthOfDate: {
//       type:DataTypes.STRING,
//       allowNull:false,
//       validate: {
//         notEmpty: {
//           msg: "birth Of Date cannot be empty"
//         },
//         notNull: {
//           msg: "birth Of Date cannot be empty"
//         }
//       }
//     },
//     phoneNumber: {
//       allowNull: false,
//       validate: {
//         notEmpty: {
//           msg: "phoneNumber cannot be empty"
//         },
//         notNull: {
//           msg: "phoneNumber cannot be empty"
//         }
//       }
//     },
//     address: DataTypes.STRING,
//     balance: DataTypes.INTEGER,
//     role: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };