const app = require("../app.js")
const request = require("supertest")

const { sequelize } = require("../models/index.js")
const { hashPassword } = require("../helpers/bcrypt.js")
const { queryInterface } = sequelize

const userData = {
    email: "halo123@mail.com",
    password: "123456",
    fullName: "halofull",
    birthOfDate: "11 januari 1999",
    phoneNumber: "0191919191",
    address: "jalan jalan ha",
    avatar: ""
}
const userData2 = {
    email: "halo1234@mail.com",
    password: "123456",
    fullName: "halof2ull",
    birthOfDate: "8 januari 1999",
    phoneNumber: "0191919191",
    address: "jalan jalan ha",
    avatar: "example.jpg"
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

describe("POST /register", () => {
    describe("Success", () => {
        test("Berhasil register", async () => {
            const { status, body } = await request(app)
                .post("/register")
                .send(userData2)

            expect(status).toBe(201)
            expect(body.message).toHaveProperty("id", expect.any(Number))
            expect(body.message).toHaveProperty("email", userData2.email)
        })
    })
    describe("Fail", ()=> {
        test("Email tidak diberikan", async()=> {
            const { status, body } = await request(app)
            .post("/register")
            .send({
                email: "",
                password: "123456",
                fullName: "halof2ull",
                birthOfDate: "8 januari 1999",
                phoneNumber: "0191919191",
                address: "jalan jalan ha",
                avatar: "example.jpg"
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Email cannot be empty")
        })
        test("Email sudah terpakai", async()=> {
            const {status, body} = await request(app)
            .post("/register")
            .send({
                email: "halo123@mail.com",
                password: "123456",
                fullName: "halof2ull",
                birthOfDate: "8 januari 1999",
                phoneNumber: "0191919191",
                address: "jalan jalan ha",
                avatar: "example.jpg"
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Email already in use!")
        })
        test("Email tidak input format email", async()=> {
            const {status, body} = await request(app)
            .post("/register")
            .send({
                email: "halohalohalo",
                password: "123456",
                fullName: "halof2ull",
                birthOfDate: "8 januari 1999",
                phoneNumber: "0191919191",
                address: "jalan jalan ha",
                avatar: "example.jpg"
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Input must be in email format")
        })
        test("Password tidak di input", async()=> {
            const {status, body} = await request(app)
            .post("/register")
            .send({
                email: "haloguys@mail.com",
                password: "",
                fullName: "halof2ull",
                birthOfDate: "8 januari 1999",
                phoneNumber: "0191919191",
                address: "jalan jalan ha",
                avatar: "example.jpg"
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "Password cannot be empty")
        })
    })
})
