# 🧪 Full-Stack Testing Guide (React + Node.js)

## 🧠 What is Testing?

**Testing** means verifying that your application works as expected.  
It ensures your app is **bug-free**, **secure**, and **maintainable** before going to production.

---

## 🎯 Why Testing is Important

| Reason | Description |
|--------|--------------|
| ✅ Reliability | Confirms code works correctly |
| 🧩 Maintainability | Makes refactoring safer |
| ⚙️ Automation | Prevents manual re-checking |
| 🚀 Production Confidence | Ensures stable deployments |
| 🔒 Security | Detects logic and validation issues early |

---

## 🧰 Key Testing Tools

| Tool | Used For | Description |
|------|-----------|-------------|
| **Jest** | Testing Framework | Most popular for Node + React |
| **Supertest** | API Testing | For backend HTTP request testing |
| **React Testing Library** | Component Testing | For testing UI behavior |
| **Vitest** | Vite-based Testing | Fast Jest alternative for React |
| **Cypress / Playwright** | E2E Testing | Simulates full user flows |
| **Mongo Memory Server / SQLite Memory** | Mock DB | Test databases without affecting real DB |
| **dotenv or --env-file** | Env Config | Loads test environment variables |


Cypress - it usually help in E2E testing means UI interection test.

---

## 🧩 Types of Testing

| Type | Scope | Purpose | Tools |
|------|--------|----------|--------|
| **Unit Testing** | Single function or component | Checks small pieces of logic | Jest, RTL |
| **Integration Testing** | Combined modules | Tests interaction between modules (e.g. API + DB) | Jest, Supertest |
| **E2E (End-to-End)** | Full app (UI → API → DB) | Tests real user journey | Cypress |
| **Mock Testing** | Fake services | Avoids hitting real APIs | Jest Mock |
| **Fixture/Factory Testing** | Test data creation | Reusable test objects | Factory Functions |

---

## 🧪 1. Unit Testing (Basic)

Test individual logic or components.

**Example (React):**
```js
import { render, screen } from '@testing-library/react';
import Todo from '../Todo';

test('renders heading', () => {
  render(<Todo />);
  expect(screen.getByText(/Todo App/i)).toBeInTheDocument();
});
```

## 2. Integration Testing (Intermediate)

Test combined modules — e.g., an API connected to a DB.

```js
import request from 'supertest';
import app from '../app.js';

test('GET /api/todos → should return todos', async () => {
  const res = await request(app).get('/api/todos');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
```

🟢 Focus:

Multiple parts working together
Example: Controller ↔ Model ↔ DB

---

## 🔒 3. Authentication Testing

Example for JWT-based login:

```js
let token;

test('POST /api/users/login', async () => {
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@example.com', password: 'test123' })
    .expect(200);

  token = res.body.token;
  expect(token).toBeDefined();
});

```

Then use token in other APIs:

```js
await request(app)
  .get('/api/todos')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
```

---

## 🧰 4. Mock Testing (Advanced)

Avoid real network calls or services (like email, AWS, etc.)
```js
import * as mailService from '../services/mailService.js';
jest.mock('../services/mailService.js');

test('send mail mock test', async () => {
  mailService.sendMail.mockResolvedValue('Sent');
  await mailService.sendMail('user@example.com');
  expect(mailService.sendMail).toHaveBeenCalled();
});
```

---


## 🧱 5. Fixtures / Factories (Reusable Test Data)

```js
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';

export const createUserFactory = async (data = {}) => {
  const password = await bcrypt.hash('test123', 10);
  return await User.create({ 
    name: 'Test User', 
    email: 'test@example.com', 
    password, 
    ...data 
  });
};

```

✅ Makes test setup clean and repeatable.

---


## 🌐 6. E2E (End-to-End Testing)

Used for real user flow testing with tools like Cypress.

Example (Cypress):

```js
describe('Todo App', () => {
  it('logs in and adds a todo', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('test123');
    cy.get('button[type="submit"]').click();
    cy.get('input[placeholder="Enter todo"]').type('New Task');
    cy.contains('Add').click();
    cy.contains('New Task').should('exist');
  });
});
```

---

## 🔄 8. Database Testing Setup (Example MongoDB)

Use mongodb-memory-server for in-memory DB.

```js 
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

```
✅ Prevents polluting your main DB.


---


## 🧩 9. Frontend Testing (React)

Example: check if button works
```js
import { render, screen, fireEvent } from '@testing-library/react';
import Todo from '../Todo';

test('adds todo when button clicked', () => {
  render(<Todo />);
  const input = screen.getByPlaceholderText(/Enter your todo/i);
  fireEvent.change(input, { target: { value: 'Test Task' } });
  fireEvent.click(screen.getByText(/Add/i));
  expect(screen.getByText('Test Task')).toBeInTheDocument();
});
```

---

| Type     | Command            | Tool             |
| -------- | ------------------ | ---------------- |
| Backend  | `npm test`         | Jest + Supertest |
| Frontend | `npm test`         | Jest + RTL       |
| E2E      | `npx cypress open` | Cypress          |

---

✅ Best Practices

Use .env.test for test environment
Use factories for data setup
Mock external APIs
Isolate each test (clean DB before each test)
Never test on production DB
Run tests automatically in CI/CD


| Concept          | Tool             | Example                       |
| ---------------- | ---------------- | ----------------------------- |
| Unit Test        | Jest             | Test small logic or component |
| Integration Test | Jest + Supertest | API + DB flow                 |
| E2E Test         | Cypress          | User journey simulation       |
| Mock             | Jest.mock()      | Replace real API              |
| Fixtures         | Factory          | Generate test users           |
| Environment      | .env.test        | Separate from prod            |





***

<p align="center">
  <a href="https://github.com/gitwithvikas/Fullstack-testing-lab">Vikas Jadhav</a>
</p>


***
