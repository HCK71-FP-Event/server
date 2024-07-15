const app = require("../app")
const { User } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface } = sequelize


const newCategory = {
    name: "Hola"
}

let access_token

beforeAll(async () => {
    await queryInterface.bulkInsert("Categories", [
        {
            name: newCategory.name,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])

    const users = require("../data/user.json").map((el)=> {
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
    await queryInterface.bulkDelete("Categories", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
    await queryInterface.bulkDelete("Users", null, {
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
})

describe("GET /categories", () => {
    describe("Success", () => {
        test("Success get all categories", async () => {
            const { status, body } = await request(app)
                .get("/categories")
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
    describe("Fail", ()=>{
        test("Fail get all categories because no access_token", async()=> {
            const {status, body} = await request(app)
            .get("/categories")
            
            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
    })
})
