const app = require("../app")
const { Category } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { queryInterface } = sequelize

describe("GET /categories", () => {
    describe("Success", () => {
        test("Success get all categories", async () => {
            const { status, body } = await request(app)
                .get("/categories")

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
})