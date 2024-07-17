const app = require("../app")
const { User, Event, Transaction } = require("../models")

const request = require("supertest")
const { sequelize } = require("../models")
const { createToken } = require("../helpers/jsonwebtoken")
const { hashPassword } = require("../helpers/bcrypt")
const { queryInterface, Sequelize } = sequelize


const dummyMidtrans = {
    transaction_status: "capture",
    status_code: 200,
    order_id: "0e9e697f-72dc-4e38-814e-1330d6c00ec0"
}
const newTransaction = {
    OrderId: "0e9e697f-72dc-4e38-814e-1330d6c00ec0",
    quantity: 10,
    amount: 100000,
    status: "pending",
    UserId: 1,
    EventId: 1
}

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
    description: "HALO ANJAY"
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
        await queryInterface.bulkDelete("Transactions", null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        })
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

            expect(status).toBe(201);
            expect(body).toHaveProperty("message", "Order created")
        });
    });
    describe("Fail", () => {
        test("Fail get transactions initiate, no access_token", async () => {
            const transaction = await Transaction.findOne()
            const { status, body } = await request(app)
                .post(`/payment/midtrans/initiate/${transaction.id}`)
                .set("Authorization", `Bearer 1203kasdkm`)
                .send({
                    quantity: newTransaction.quantity
                })

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail get transactions initiate because no event", async () => {
            const { status, body } = await request(app)
                .post(`/payment/midtrans/initiate/101010`)
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    quantity: newTransaction.quantity
                })

            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Data Not Found")
        })
        test("Fail out of stock", async ()=> {
            const{status, body} = await request(app)
            .post("/payment/midtrans/initiate/1")
            .set("Authorization", `Bearer ${access_token}`)
            .send({
                quantity: 11
            })

            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Ticket out of stock")
        })
        test("Fail because quantity is empty", async ()=> {
            const{status, body} = await request(app)
            .post("/payment/midtrans/initiate/1")
            .set("Authorization", `Bearer ${access_token}`)
            .send({
                quantity: 0
            })
           
            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Data Not Found")
        })
    })
})

describe("POST /payment/notification", ()=> {
    describe("Success", ()=> {
        test("Succes get notification after payment", async()=> {
            const {status, body } = await request(app)
            .post("/payment/notification")
            .send(dummyMidtrans)

            expect(status).toBe(200)
            expect(body).toHaveProperty("message", `${dummyMidtrans.order_id} transaction paid`)
        })
    })
    describe("Fail", ()=> {
        test("Fail to get transaction", async()=> {
            const{status, body}= await request(app)
            .post("/payment/notification")
            .send({
                transaction_status: "capture",
                status_code: 200,
                order_id: "wk"
            })
           
            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Data Not Found")
        })
    })
})

describe("POST /payment/free-event/:eventId", () => {
    describe("Success", () => {
        test("Success get transactions initiate EventFree", async () => {
            const transactions = await Transaction.findOne()
            const { status, body } = await request(app)
                .post(`/payment/free-event/${transactions.id}`)
                .set("Authorization", `Bearer ${access_token}`)
                .send({
                    quantity: newTransaction.quantity
                })

            expect(status).toBe(201)
            expect(body).toHaveProperty("message", "Order created!")
        })
    })
    describe("Fail", () => {
        test("Fail, no access_token", async () => {
            const transactions = await Transaction.findOne()
            const { status, body } = await request(app)
                .post(`/payment/free-event/${transactions.id}`)
                .set("Authorization", `Bearer awokkoawkowa`)
                .send({
                    quantity: newTransaction.quantity
                })

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail, no quantity", async () => {
            const transactions = await Transaction.findOne()
            const { status, body } = await request(app)
                .post(`/payment/free-event/${transactions.id}`)
                .set("Authorization", `Bearer ${access_token}`)


            expect(status).toBe(400)
            expect(body).toHaveProperty("message", "quantity cannot be empty")
        })
        test("Fail because out of stock", async ()=> {
            const transactions = await Transaction.findOne()
            const{status, body} = await request(app)
            .post(`/payment/free-event/${transactions.id}`)
            .set("Authorization", `Bearer ${access_token}`)
            .send({
                quantity: 200
            })

            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Ticket out of stock")
        })
        test("Fail because event not found", async ()=> {
            const{status, body} = await request(app)
            .post(`/payment/free-event/123123123`)
            .set("Authorization", `Bearer ${access_token}`)
            .send({
                quantity: newTransaction.quantity
            })

            expect(status).toBe(404)
            expect(body).toHaveProperty("message", "Data Not Found")
        })
    })
})

describe("GET /transactions", () => {
    describe("Success", () => {
        test("Success getting transactions", async () => {
            const { status, body } = await request(app)
                .get("/transactions")
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
    describe("Fail", () => {
        test("Fail get transactions no access_token", async () => {
            const { status, body } = await request(app)
                .get("/transactions")

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal server Error", async()=> {
            jest.spyOn(Transaction, "findAll")
            .mockRejectedValue("Internal server error")

            const { status, body } = await request(app)
            .get("/transactions")
            .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })
})
describe("GET /transactions/:id", () => {
    describe("Success", () => {
        test("Success getting transactions", async () => {
            const trans = await Transaction.findOne()
            const { status, body } = await request(app)
                .get(`/transactions/${trans.id}`)
                .set("Authorization", `Bearer ${access_token}`)

            expect(status).toBe(200)
            expect(body).toBeInstanceOf(Object)
        })
    })
    describe("Fail", () => {
        test("Fail getting transactions id, no access_token", async () => {
            const trans = await Transaction.findOne()
            const { status, body } = await request(app)
                .get(`/transactions/${trans.id}`)
                .set("Authorization", `Bearer 10239103291023`)

            expect(status).toBe(401)
            expect(body).toHaveProperty("message", "Invalid token")
        })
        test("Fail Internal Server Error", async ()=> {
            jest.spyOn(Transaction, "findByPk")
            .mockRejectedValue("Internal server error")

            const trans = await Transaction.findOne()
            const { status, body } = await request(app)
                .get(`/transactions/${trans.id}`)
                .set("Authorization", `Bearer ${access_token}`)
    
            expect(status).toBe(500)
            expect(body).toHaveProperty("message", "Internal server error")
        })
    })
})



