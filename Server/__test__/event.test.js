const app = require("../app")
const { User, Sequelize } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface } = sequelize

const newEvent = {
    name: "Event A",
    imageUrl: "https://example.com/imageA.jpg",
    location: {
        type: "Point",
        coordinates: [106.7827090935093, -6.26326708553454]
    },
}

let access_token

beforeAll(async () => {
    await queryInterface.bulkInsert("Events", [
        {
            name: newEvent.name,
            imageUrl: newEvent.imageUrl,
            location: Sequelize.fn('ST_GeomFromText', `POINT(${newEvent.location.coordinates.long} ${newEvent.location.coordinates.lat})`),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);

    const users = require("../data/user.json").map((el) => {
        el.createdAt = el.updatedAt = new Date();
        el.password = hashPassword(el.password);
        return el;
    });

    await queryInterface.bulkInsert("Users", users);

    const user = await User.findOne({
        where: {
            email: users[0].email
        }
    });
    access_token = createToken({ id: user.id });
});



afterAll(async () => {
    await queryInterface.bulkDelete("Events", null, {
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

describe("GET /event", () => {
    describe("Success", () => {
        test("Success get events", async () => {
            const { status, body } = await request(app)
                .get("/event")
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
})

describe("GET /allEvent", () => {
    describe("Success", () => {
        test("Success get allEvent", async () => {
            const { status, body } = await request(app)
            .get("/allEvent")
            .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
})

describe("GET /allEvent/:id", ()=> {
    describe("Success", ()=> {
        test("Success get allEvent By Id params", async ()=> {
            const{status, body} = await request(app)
            .get("/allEvent/1")
            .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
})