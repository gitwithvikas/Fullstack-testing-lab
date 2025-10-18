
| Level                       | What You Learned                                                               | Tools Used               |
| --------------------------- | ------------------------------------------------------------------------------ | ------------------------ |
| **1️⃣ Unit Testing**        | Testing small individual functions (e.g., utils, controllers).                 | Jest                     |
| **2️⃣ Integration Testing** | Testing routes with DB or services combined (e.g., `/api/todos` with MongoDB). | Jest + Supertest         |
| **3️⃣ Database Mocking**    | Using `mongodb-memory-server` to isolate DB for testing.                       | Jest + MongoMemoryServer |
| **4️⃣ Authentication Flow** | Handling login, JWT, and token-based tests.                                    | Supertest + JWT          |
| **5️⃣ Environment Setup**   | Using `.env.test` and Node native `--env-file`.                                | Node v20+                |
| **6️⃣ Test Lifecycle**      | Using `beforeAll`, `afterAll`, `beforeEach`, `afterEach` hooks.                | Jest                     |





#### Recommended Production Setup (2025)

If your stack is React (frontend) + Node.js (backend):

- Vitest → unit + integration (frontend + backend, consistent)
- Supertest → API endpoint testing
- mongodb-memory-server or SQLite → DB tests
- Testing Library (frontend only)
- If backend is separate / older →

Jest + Supertest → most common in backend production.


### Install libraries

```js
// for testing
npm install jest supertest mongodb-memory-server

```

- [https://jestjs.io/docs/getting-started](Jest)
-It is the best library for testing
- [https://www.npmjs.com/package/supertest](Supertest)
It is the best library for testing API endpoints
- [https://www.npmjs.com/package/mongodb-memory-server](mongodb-memory-server)
It is the best library for testing DB




### Create separate folder for tests

    test/api-tests.js


### If we are using secret and want to use in testing environment then we can create .env.test file in root folder and set JWT_SECRET variable in it.

Make sure 

The catch here is that Jest doesn’t use Node CLI arguments internally,
so the --env-file flag doesn’t automatically work when you run npm test.
so we need to use dotenv package in testing file to load .env file in testing environment.



> Note: If we are testing API endpoints and creating testing User in database then it will not reflect actually database but it will create user in in-memory and will reflect in API testing duration time.



#### Now Nodejs .env nativaly support in nodejs 20.5.0 and above

##### we can use two way to load .env

```js
// we can use loadEnvFile() function to load .env file  in index.js file
import { loadEnvFile } from 'node:process';
loadEnvFile(); // Loads the .env file

```

```js
//  we start project with .env file
// node --env-file=.env index.js
"start": "node --env-file=.env index.js",
```


 ---


### 1.  Factories / fixtures
### 2.  Mocking external 
### 3.  E2E testing


There are the three big advanced testing concepts used in real-world production setups, and understanding them will make you think like a professional software engineer, not just a coder.



#### 🧩 1️⃣ Test Factories / Fixtures
🔍 Concept:

When you write tests, you often need fake data (users, todos, posts, etc.).
Instead of manually typing dummy data in every test, you create a factory or fixture — a reusable “data generator” for your tests.

🧠 Analogy:

Think of it like a machine that automatically makes sample users whenever you need one.

Instead of doing this in 10 tests:
```js
await User.create({ name: "John", email: "john@example.com", password: "123" });
```

You just do:
```js
await createUser();
```
🛠 Example (Factory function):
```js
// test/factories/userFactory.js
import User from '../../models/User.js';
import bcrypt from 'bcrypt';

export async function createUser(overrides = {}) {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: await bcrypt.hash('password', 10),
  };

  const user = new User({ ...defaultUser, ...overrides });
  await user.save();
  return user;
}
```

Now in your tests:

```js
import { createUser } from '../factories/userFactory.js';

test('GET /api/users/:id', async () => {
  const user = await createUser();
  const res = await request(app).get(`/api/users/${user._id}`).expect(200);
  expect(res.body.email).toBe(user.email);
});
```


✅ Reusable
✅ Randomized
✅ Realistic

💡 Sometimes called:

“Factories” (if dynamic)
“Fixtures” (if static, pre-defined data used again and again)

#### 🧩 2️⃣ Mocking External Services
🔍 Concept:

In production, your backend might call third-party APIs (like Stripe, SendGrid, AWS, etc.).

During testing:

You don’t want to hit real APIs
You don’t want real payments, emails, or network calls
So, you mock them — i.e., fake their behavior.

🧠 Analogy:

Imagine you’re testing a pizza delivery app 🍕
You don’t want to actually order pizzas each time.
Instead, you fake a “successful delivery response”.



🛠 Example (Using nock):

```js
import nock from 'nock';
import request from 'supertest';
import app from '../../app.js';

test('POST /api/payments', async () => {
  // Mock Stripe API
  nock('https://api.stripe.com')
    .post('/v1/charges')
    .reply(200, { id: 'ch_12345', status: 'succeeded' });

  const res = await request(app).post('/api/payments').send({
    amount: 500,
    card: 'tok_visa'
  });

  expect(res.status).toBe(200);
  expect(res.body.status).toBe('succeeded');
});

```


✅ No real Stripe call
✅ Instant & safe
✅ Repeatable test results


| Tool                        | Use Case                           |
| --------------------------- | ---------------------------------- |
| `nock`                      | Mock HTTP requests                 |
| `jest.mock()`               | Mock internal modules or libraries |
| `msw` (Mock Service Worker) | Mock APIs in frontend/browser      |
| `sinon`                     | Mock or spy on functions           |


#### 🧩 3️⃣ End-to-End (E2E) Testing

🔍 Concept:

E2E = testing the app from the user’s perspective
It checks the whole flow — from frontend → backend → database → response.
Unit test = tests small pieces (like 1 function)
Integration test = tests connected components (like API + DB)
E2E = tests the whole app like a real user

🧠 Analogy:

Imagine you’re testing Uber:
Open the app
Login
Book a ride

Get driver info
That’s an E2E test.

You’re testing the full system, not just one function.


```js
// cypress/e2e/todoFlow.cy.js
describe('Todo App Flow', () => {
  it('should create a new todo successfully', () => {
    cy.visit('http://localhost:5173');

    // Login
    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password');
    cy.get('button').contains('Login').click();

    // Add todo
    cy.get('input[placeholder="Enter your todo here"]').type('Buy groceries');
    cy.get('button').contains('Add').click();

    // Check if new todo appears
    cy.contains('Buy groceries').should('be.visible');
  });
});
```

✅ Opens browser
✅ Interacts with frontend
✅ Sends API requests
✅ Checks full workflow works


| Tool               | Used For               | Works With               |
| ------------------ | ---------------------- | ------------------------ |
| **Cypress**        | Frontend + API testing | React, Node              |
| **Playwright**     | Browser automation     | React, Node              |
| **Puppeteer**      | Chrome automation      | Headless browser testing |
| **Postman/Newman** | API-only flow testing  | Backend APIs             |
