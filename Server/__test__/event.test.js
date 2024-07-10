const app = require("../app");
const { User, Event, sequelize } = require("../models");
const request = require("supertest");
const { createToken } = require("../helpers/jsonwebtoken");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

const newEvent = {
    name: "Event A",
    imageUrl: "https://example.com/imageA.jpg",
    location: {
        type: "Point",
        coordinates: [106.7827090935093, -6.26326708553454]
    },
    CategoryId: 1,
    eventDate: "2024-07-08",
    quantity: 10,
    isFree: true,
    price: 100
};

let access_token;

beforeAll(async () => {
    try {
        await queryInterface.bulkInsert("Events", [
            {
                name: newEvent.name,
                imageUrl: newEvent.imageUrl,
                location: {
                    type: "Point",
                    coordinates: Sequelize.fn('ST_GeomFromText', `POINT(${newEvent.location.coordinates[0]} ${newEvent.location.coordinates[1]})`)
                },
                CategoryId: newEvent.CategoryId,
                eventDate: newEvent.eventDate,
                quantity: newEvent.quantity,
                isFree: newEvent.isFree,
                price: newEvent.price,
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

        const user = await User.findOne({ where: { email: users[0].email } });
        access_token = createToken({ id: user.id });
    } catch (error) {
        console.error("Error during beforeAll:", error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await queryInterface.bulkDelete("Events", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
        await queryInterface.bulkDelete("Users", null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        });
    } catch (error) {
        console.error("Error during afterAll:", error);
        throw error;
    }
});

describe("GET /event", () => {
    describe("Success", () => {
        test("Success get events", async () => {
            const { status, body } = await request(app)
                .get("/event")
                .set("Authorization", `Bearer ${access_token}`);

            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array);
        });
    });
});

describe("GET /allEvent", () => {
    describe("Success", () => {
        test("Success get allEvent", async () => {
            const { status, body } = await request(app)
                .get("/allEvent")
                .set("Authorization", `Bearer ${access_token}`);

            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array);
        });
    });
});

describe("GET /allEvent/:id", () => {
    describe("Success", () => {
        test("Success get allEvent By Id params", async () => {
            const event = await Event.findOne();
            const { status, body } = await request(app)
                .get(`/allEvent/${event.id}`)
                .set("Authorization", `Bearer ${access_token}`);

            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });
    });
});
