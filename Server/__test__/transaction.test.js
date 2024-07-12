const app = require("../app")
const { User } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface } = sequelize

const newTransaction = {
    OrderId: 1,
    quantity: 100,
    amount: 1000,
    status: "pending",
    UserId: 1,
    EventId: 1
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
    price: 100
};

let access_token

beforeAll(async () => {
    try {
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
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        await queryInterface.bulkInsert("Transactions", [
            {
                OrderId: newTransaction.OrderId,
                quantity: newTransaction.quantity,
                amount: newTransaction.amount,
                status: newTransaction.status,
                UserId: newTransaction.UserId,
                EventId: newTransaction.EventId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

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
        await queryInterface.bulkDelete("Transactions", null, {
            truncate: true, 
            cascade: true, 
            restartIdentity: true
        })
    } catch (error) {
        console.error("Error during afterAll:", error);
        throw error;
    }
});
