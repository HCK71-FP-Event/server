const app = require("../app");
const { User, Event, sequelize } = require("../models");
const request = require("supertest");
const { createToken } = require("../helpers/jsonwebtoken");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface, Sequelize } = sequelize;


const newCat = {
    name: "music"
}
const newEvent = {
    name: "Event A",
    imageUrl: "https://example.com/imageA.jpg",
    location: {
        type: "Point",
        coordinates: {
            long: 106.7827090935093,
            lat: -6.26326708553454
        }
    },
    CategoryId: 1,
    eventDate: "2024-07-08",
    quantity: 10,
    isFree: true,
    price: 100,
    description: "Halo anjay"
};

let access_token;

beforeAll(async () => {
    try {
        const users = require("../data/user.json").map((el) => {
            el.createdAt = el.updatedAt = new Date();
            el.password = hashPassword(el.password);
            return el;
        });
        await queryInterface.bulkInsert("Users", users);

        const user = await User.findOne({ where: { email: users[0].email } });
        access_token = createToken({ id: user.id });

        const category = await queryInterface.bulkInsert("Categories", [
            {
                name: newCat.name,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

        await queryInterface.bulkInsert("Events", [
            {
                name: newEvent.name,
                imageUrl: newEvent.imageUrl,
                location: Sequelize.fn(
                    "ST_GeomFromText",
                    `POINT(${newEvent.location.coordinates.long} ${newEvent.location.coordinates.lat})`
                ),
                CategoryId: newEvent.CategoryId,
                eventDate: newEvent.eventDate,
                quantity: newEvent.quantity,
                isFree: newEvent.isFree,
                price: newEvent.price,
                description: newEvent.description,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);


    } catch (error) {
        console.error("Error during beforeAll:", error);
        throw error;
    }
});

beforeEach(()=> {
    jest.restoreAllMocks()
})

afterAll(async () => {
    try {
        await queryInterface.bulkDelete("Events", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
        await queryInterface.bulkDelete("Categories", null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        })

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


describe("POST /event", () => {
    describe("Success", () => {
        test("Success create Event", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    "name": "test",
                    "imageUrl": "example.jpg",
                    "CategoryId": 1,
                    "eventDate": "2024-08-08",
                    "quantity": 100,
                    "description": "halo",
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454
                })

            expect(status).toBe(201)
            expect(body).toHaveProperty("message", "event test created!")
        })
    })
    describe("Fail", () => {
        test("name is empty", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    "name": "",
                    "imageUrl": "example.jpg",
                    "CategoryId": 1,
                    "eventDate": "2024-08-08",
                    "quantity": 100,
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454

                })
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "name cannot be empty")
        })
        test("image is empty", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    "name": "test",
                    "imageUrl": "",
                    "CategoryId": 1,
                    "eventDate": "2024-08-08",
                    "quantity": 100,
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454

                })
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "imageUrl cannot be empty")
        })
        test("eventDate is empty", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    "name": "test",
                    "imageUrl": "example.jgp",
                    "CategoryId": 1,
                    "eventDate": "",
                    "quantity": 100,
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454

                })
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "eventDate cannot be empty")
        })
        test("quantity is empty", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    "name": "test",
                    "imageUrl": "example.jgp",
                    "CategoryId": 1,
                    "eventDate": "2024-08-08",
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454

                })
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "quantity cannot be empty")
        })
        test("token is invalid", async () => {
            const { status, body } = await request(app)
                .post("/event")
                .set("Authorization", `Bearer 12031209312930129`)
                .send({
                    "name": "test",
                    "imageUrl": "example.jgp",
                    "CategoryId": 1,
                    "eventDate": "2024-08-08",
                    "long": 106.7827090935093,
                    "lat": -6.26326708553454

                })
            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
    })
})


describe("GET /event", () => {
    describe("Success", () => {
        test("Success get events", async () => {
            const { status, body } = await request(app)
                .get("/event")
                .set("Authorization", `Bearer ${access_token}`);

            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });
    });
    describe("Fail", () => {
        test("Fail get events, no access_token", async () => {
            const { status, body } = await request(app)
                .get("/event")

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal Server Error", async ()=> {
            jest.spyOn(sequelize, "query")
            .mockRejectedValue("Internal server error")

            const { status, body } = await request(app)
            .get("/event")
            .set("Authorization", `Bearer ${access_token}`)
    
            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })
});

describe("GET /allEvent", () => {
    describe("Success", () => {
        test("Success get allEvent", async () => {
            const { status, body } = await request(app)
                .get("/allEvent")
                .set("Authorization", `Bearer ${access_token}`);

            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });
    });
    describe("Fail", () => {
        test("Fail get allEvents, no access_token", async () => {
            const { status, body } = await request(app)
                .get("/allEvent")

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal Server Error", async ()=> {
            jest.spyOn(Event, "findAll")
            .mockRejectedValue("Internal server error")

            const { status, body } = await request(app)
            .get("/allEvent")
            .set("Authorization", `Bearer ${access_token}`)
    
            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })

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
    describe("Fail", () => {
        test("Fail get allEvent by id , no access_token", async () => {
            const event = await Event.findOne()
            const { status, body } = await request(app)
                .get(`/allEvent/${event.id}`)

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail get allEvent by id is not found", async () => {
            const { status, body } = await request(app)
                .get(`/allEvent/1231231`)
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Data Not Found")
        })
    })
})
