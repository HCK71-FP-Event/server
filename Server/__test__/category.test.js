const app = require("../app")
const { Category } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { queryInterface } = sequelize


const newCategory = {
    name: "Hola"
}

const newCategory2 = {
    name: "Oi Apa Kabar"
}

beforeAll(async () => {
    await queryInterface.bulkInsert("Categories", [
        {
            name: newCategory.name,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])
})

afterAll(async () => {
    await queryInterface.bulkDelete("Categories", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})

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
describe("POST /categories", () => {
    describe("Success", () => {
        test("Success creating categories", async () => {
            const { status, body } = await request(app)
                .post("/categories")
                .send(newCategory2)

            expect(status).toBe(201)
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty("id", expect.any(Number))
            expect(body).toHaveProperty("name", newCategory2.name)
        })
    })
    describe("Fail", ()=> {
        test("name of the category cannot be empty", async ()=> {
            const{status, body} = await request(app) 
            .post("/categories")
                .send({
                    name: ""
                })
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "name cannot be empty")
        })
    })
})