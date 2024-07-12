const app = require("../app")
const { User, Event, Transaction } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface, Sequelize } = sequelize

const newTransaction = {
    OrderId: 1,
    quantity: 10,
    amount: 100000,
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
        
        const users = require("../data/user.json").map((el) => {
            el.createdAt = el.updatedAt = new Date();
            el.password = hashPassword(el.password);
            return el;
        });
        await queryInterface.bulkInsert("Users", users);

        const user = await User.findOne({ where: { email: users[0].email } });
        access_token = createToken({ id: user.id });
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
                quantity: 2,
                amount: newTransaction.amount,
                status: newTransaction.status,
                UserId: newTransaction.UserId,
                EventId: newTransaction.EventId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

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


describe("POST /payment/midtrans/initiate/:eventId", () => {
    describe("Success", () => {
        test("Success get transactions initiate", async () => {
            const transaction = await Transaction.findOne()
            const { status, body } = await request(app)
            .post(`/payment/midtrans/initiate/${transaction.id}`)
            .set("Authorization", `Bearer ${access_token}`)
            .send({
                quantity: newTransaction.quantity
            })

            expect(status).toBe(200);
            expect(body).toHaveProperty("message", "Order created")
        });
        test("Success get transactions", async () => {
            const { status, body } = await request(app)
                .get("/transactions")
                .set("Authorization", `Bearer ${access_token}`)
    
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
        test("Success get transaction/:id", async () => {
            const transactions = await Transaction.findOne()
            const { status, body } = await request(app)
                .get(`/transactions/${transactions.id}`)
                .set("Authorization", `Bearer ${access_token}`)
    
            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    });
    describe("Fail", ()=> {
        test("Fail get transactions initiate", async ()=> {
            const transaction = await Transaction.findOne()
            const { status, body } = await request(app)
             .get(`/payment/midtrans/initiate/${transaction.id}`)
             .set("Authorization", `Bearer 1203kasdkm`)

             expect(status).toBe(401)
             expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail get transactions no access_token", async()=> {
            const {status, body} = await request(app)
            .get("/transactions")
            
            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
    })
})