const app = require("../app.js")
const request = require("supertest")

const { sequelize } = require("../models")
const { queryInterface } = sequelize
const { hashPassword } = require("../helpers/bcrypt.js")

const userData = {
    email: "halo@mail.com",
    password: "12345",
    fullName: "halofull",
    birthOfDate: "3 januari 1999",
    phoneNumber: "0818181818",
    address: "jalan kalikali",
    avatar: "ha",
    role: "ha"

}

beforeAll(async () => {
    await queryInterface.bulkInsert("Users", [
        {
            email: userData.email,
            password: hashPassword(userData.password),
            fullName: userData.fullName,
            birthOfDate: userData.birthOfDate,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            avatar: userData.avatar,
            role: userData.role,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])

})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})



describe("POST /login", () => {
    describe("Success", () => {
        test("Success login and get access_token", async () => {
            const { status, body } = await request(app)
                .post("/login")
                .send(userData)

            expect(status).toBe(200)
            expect(body).toHaveProperty("access_token", expect.any(String))
        },)
    })
    describe("Fail", () => {
        test("Email is empty ", async () => {
            const { status, body } = await request(app)
                .post("/login")
                .send({
                    email: "",
                    password: "12345"
                })

            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Email cannot be empty")

        }, 23000)
        test("Password is empty", async () => {
            const { status, body } = await request(app)
                .post("/login")
                .send({
                    email: "halo@mail.com",
                    password: ""
                })


            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Password cannot be empty")
        },)
        test("Email is unrecognized", async () => {
            const { status, body } = await request(app)
                .post("/login")
                .send({
                    email: "halooo@mail.com",
                    password: "12345"
                })

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Email or Password invalid")
        },)
        test("Password is unrecognized", async () => {
            const { status, body } = await request(app)
                .post("/login")
                .send({
                    email: "halo@mail.com",
                    password: "123123"
                })

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Email or Password invalid")
        },)
    })
})
