const app = require("../app")
const { User } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface } = sequelize

let access_token

beforeAll(async () => {
    const users = require("../data/user.json").map((el) => {
        el.createdAt = el.updatedAt = new Date()

        el.password = hashPassword(el.password)

        return el
    })
    await queryInterface.bulkInsert("Users", users)

    const user = await User.findOne({
        where: {
            email: users[0].email
        }
    })
    access_token = createToken({ id: user.id })
})

beforeEach(()=> {
    jest.restoreAllMocks()
})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })

})


describe("PUT /user", () => {
    describe("Success", () => {
            test("Success update user", async () => {
                const { status, body } = await request(app)
                    .put(`/user`)
                    .set("Authorization", `Bearer ${access_token}`)
                    .send({
                        email: "hallalal@mail.com",
                        fullName: "anjayanjayanjy!",
                        phoneNumber: "12839182391823",
                        address: "JALAN JALAN KE KOTA MUDA",
                        avatar: "example.jpg",
                        birthOfDate: "2002-02-02"
                    });

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "User updated!")
            });

    });

    describe("Fail", () => {
        test("Fail to get user id by params", async () => {
            const { status, body } = await request(app)
                .put("/user")
                .set("Authorization", `Bearer 123123123`)
                .send({
                    email: "hallalal@mail.com",
                    fullName: "anjay anjay anjy!",
                    phoneNumber: "12839182391823",
                    address: "JALAN JALAN KE KOTA MUDA",
                    avatar: "example.jpg",
                    birthOfDate: "2022-02-02"
                })

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal Server Error", async () => {
            jest.spyOn(User, "findByPk")
                .mockRejectedValue("Internal server error")

            const { status, body } = await request(app)
                .put("/user")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    email: "hallalal@mail.com",
                    fullName: "anjay anjay anjy!",
                    phoneNumber: "12839182391823",
                    address: "JALAN JALAN KE KOTA MUDA",
                    avatar: "example.jpg",
                    birthOfDate: "2022-02-02"
                })

            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })
})