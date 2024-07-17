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


afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })

})
describe("GET /currentUser", () => {
    // describe("Success", () => {
    //     test("Success getting user id by params", async () => {
    //         const { status, body } = await request(app)
    //             .get("/user/1")
    //             .set("Authorization", `Bearer ${access_token}`)

    //         expect(status).toBe(200)
    //         expect(body).toBeInstanceOf(Object)
    //     })
    // })
    describe("Success", () => {
        test("Success get currentUser", async () => {
            const { status, body } = await request(app)
                .get("/currentUser")
                .set("Authorization", `Bearer ${access_token}`)

                expect(status).toBe(200)
                expect(body).toBeInstanceOf(Object)
        })
    })
})

describe("Fail", () => {
    // test("Fail to get user id by params", async () => {
    //     const { status, body } = await request(app)
    //         .get("/user/123123123")
    //         .set("Authorization", `Bearer ${access_token}`)

    //     expect(status).toBe(404)
    //     expect(body).toHaveProperty("message", "Data Not Found")
    // })
    // test("Fail to get User because no access_token", async () => {
    //     const { status, body } = await request(app)
    //         .get("/user/1")
    //         .set("Authorization", `Bearer 123123123123213123123`)

    //     expect(status).toBe(401)
    //     expect(body).toHaveProperty("message", "Invalid token")
    // })
    test("Fail to get currentUser, no access_token", async ()=> {
        const{status, body} = await request(app)
        .get("/currentUser")
        .set("Authorization", `Bearer 1231asd`)
        
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Invalid token")
    })
   
})