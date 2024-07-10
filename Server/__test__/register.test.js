const app = require("../app.js")
const request = require("supertest")

const {sequelize} = require("../models/index.js")
const {queryInterface} = sequelize 

const userData = {
    email: "halo123@mail.com",
    password: "123456",
    fullName: "halofull",
    birthOfDate: "11 januari 1999",
    phoneNumber: "0191919191",
    address: "jalan jalan ha"
}