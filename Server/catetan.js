// bikin model :
// npx sequelize-cli model:create --name Grocery --attributes title:string,price:integer,tag:string,imageUrl:string,UserId:integer

// bikin seed :
// npx sequelize-cli seed:create --name nama_seed

// create db :
// npx sequelize-cli db:create

// migrate db :
// npx sequelize-cli db:migrate

// seed db :
// npx sequelize-cli db:seed:all

// Step:
// npm init -y
// npm install jest supertest express pg sequelize sequelize-cli nodemon bcryptjs jsonwebtoken
// sequelize init + create folder
// setting config
// create model
// setup model + migration
// 6.5. create db, migration + seed (optional)
// setup helpers
// 7.5. create router + controllers
// create app.js + bin/www
// body parser => urlencoded dan json
// listing route
// setup middleware + error handler
// kerja


// How to run test :
// asdasdasd npx sequelize-cli db:create --env test

// migrate db :
// asdagasdasd npx sequelize-cli db:migrate --env test

// run this command npx jest --detectOpenHandles --forceExit --verbose


// npx sequelize-cli model:create --name User --attributes email:string,password:string,fullName:string,birthOfDate:string,phoneNumber:string,address:string,balance:integer,role:string
//  npx sequelize-cli model:create --name Transaction --attributes orderId:integer,amount:integer,isPay:boolean,UserId:integer,EventId:integer
// npx sequelize-cli model:create --name Event --attributes name:string,imageUrl:string,eventDate:date,CategoryId:integer
// npx sequelize-cli model:create --name Category --attributes name:string