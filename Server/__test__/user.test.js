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


describe("GET /currentUser", () => {
    describe("Success", () => {
        test("Success get currentUser", async () => {
            const { status, body } = await request(app)
                .get("/currentUser")
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
    describe("Fail", () => {
        test("Fail to get currentUser, no access_token", async () => {
            const { status, body } = await request(app)
                .get("/currentUser")
                .set("Authorization", `Bearer 1231asd`)

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal Server Error", async () => {
            jest.spyOn(User, "findByPk")
                .mockRejectedValue("Internal server error")

            const { status, body } = await request(app)
                .get("/currentUser")
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })
})




