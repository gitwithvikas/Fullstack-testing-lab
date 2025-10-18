
const request = require('supertest')
const app = require('../../index')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config({path:".env.test"})



let mongodbServer;
let testUser;
let token;

// here beforeAll function is basically call before each testing, afterEach function call after each testing and afterAll function call after completing all testing.

beforeAll(async () => {
    mongodbServer = await MongoMemoryServer.create()
    const uri = mongodbServer.getUri()
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


     // 2.  Create one reusable user for all tests
//   testUser = await User.create({
//     name: "Test User",
//     email: "test@example.com",
//     password: "testpassword",
//   });

   

  // 3.  Create a test user
   const response = await request(app)
    .post('/api/users')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword'
    })
    .expect(201);

  testUser = response.body.user;


// here process.env.JWT_SECRET variable will not work because testing is happen in seperate evironment so we can set default value for that otherwise we can create .env.test file for it in root folder it will work fine.

// And use with dotenv package 


})


afterEach(async () => {
    // Clean all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongodbServer) {
        await mongodbServer.stop();
    }
})




test('GET /api/todos', async () => {
    const response = await request(app)
    .get('/api/todos')
    .set('Authorization',`Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    // expect(response.body).toHaveLength(0)
})



// if we need to authenicate user on each api call then 


describe('Api testing ',()=>{

// 3.  if we use SignIn first so it will run and immediately Signup run so it will create issue that's why we use SignUp in beforeAll function 


    // test("POST /api/users",async ()=>{
    //     const response = await request(app)
    //     .post('/api/users')
    //     .send({
    //         name:'Test User',
    //         email:'test@example.com',
    //         password:'testpassword'
    //     }).expect(201)

    //     expect(response.body.user.name).toBe('Test User')
    //     expect(response.body.user.email).toBe('test@example.com')
    //     expect(response.body.user.password).not.toBe('testpassword')
    //     testUser = response.body.user

    // })


    test('POST /api/users/login',async ()=>{
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email:'test@example.com',
            password:'testpassword'
        }).expect(200)

        expect(response.body.token).toBeDefined()
        token = response.body.token
      
    })



    test('POST /api/todos',async ()=>{
        const response = await request(app)
        .post('/api/todos')
        .set('Authorization',`Bearer ${token}`)
        .send({
            title: 'Test todo',
            description: 'Test todo description',
            user:testUser._id.toString()
        }).expect(201)

        expect(response.body.todo.title).toBe('Test todo')
        expect(response.body.todo.description).toBe('Test todo description')
        expect(response.body.todo.user).toBe(testUser._id.toString())
    })
})




// //  2. here we are creating user in in-memory database and passing userId to api -  see in beforeAll function 

// describe('Api testing ',()=>{
//     test('POST /api/todos',async ()=>{
//         const response = await request(app).post('/api/todos').send({
//             title: 'Test todo',
//             description: 'Test todo description',
//             user:testUser._id.toString()
//         }).expect(201)

//         expect(response.body.todo.title).toBe('Test todo')
//         expect(response.body.todo.description).toBe('Test todo description')
//         expect(response.body.todo.user).toBe(testUser._id.toString())
//     })
// })




//  1. here we can directly use userId from database just copy and paste it

// test('POST /api/todos',async ()=>{
//     const response = await request(app).post('/api/todos').send({
//         title: 'Test todo',
//         description: 'Test todo description',
//         user:'68dfbd592090b1909d05c653'
//     }).expect(201)

//     console.log(response.body)
    
//     expect(response.body.todo.title).toBe('Test todo')
//     expect(response.body.todo.description).toBe('Test todo description')
//     expect(response.body.todo.user).toBe('68dfbd592090b1909d05c653')

// })

