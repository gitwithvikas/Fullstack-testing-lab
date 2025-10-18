# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Testing React

Testing is a crucial part of the development process. It ensures that your application works as expected and that any changes you make to the codebase do not introduce new bugs.

### Why Testing in Frontend?

Features work as expected (functional correctness).
Prevents bugs when refactoring.
Provides confidence before deployment.
Saves time (catch bugs early, not in production).

### Types of Testing in Frontend (React focus)

In production, teams usually follow a testing pyramid:

#### Unit Tests 🧩

- Test individual components, hooks, or utility functions.
- Example: Check if a button renders with correct text.
- Tools: Vitest (Vite-native), Jest.

#### Integration Tests 🔗

- Test how components interact with each other.
- Example: Form → input text → submit → API call mocked.
- Tools: React Testing Library (RTL) + Vitest/Jest.

#### End-to-End (E2E) Tests 🌍

- Test the full app flow in the browser.
- Example: User logs in → redirected to dashboard → sees profile.
- Tools: Cypress, Playwright.

#### Visual/Regression Testing 🎨

- Catch unexpected UI changes.
- Tools: Percy, Chromatic.
- Performance Testing ⚡ (less common for frontend devs, but still important).
- Lighthouse, WebPageTest.

# Setting Up Testing (React + Vite)

Let’s start with basics:

#### Install Unit/Integration Testing Tools

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### Add test config in vite.config.js:

```js
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
```

#### src/setupTests.js:

```js
import "@testing-library/jest-dom";
```

#### Example Unit Test

##### Button.jsx

```js
export default function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```

##### Button.test.jsx

```js
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders button and handles click", () => {
  const mockFn = vi.fn();
  render(<Button onClick={mockFn}>Click Me</Button>);

  const btn = screen.getByText(/Click Me/i);
  fireEvent.click(btn);

  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(btn).toBeInTheDocument();
});
```

##### Run tests:

```bash
npm run test
```

### What is Integration Testing?

Unit tests = check individual pieces in isolation.

Integration tests = check how pieces work together.

👉 In React, that usually means testing parent + child components, or component + API, or component + context/store.

### High-Level Categories of Testing

- Manual Testing
  Humans test features by hand.
  Types: exploratory, ad-hoc, usability testing.

- Automated Testing
  Scripts/tools run tests automatically.
  Types: unit, integration, end-to-end (E2E), regression, etc.

### These levels fall under functional testing → ensuring the app does what the user expects.

There are also higher categories like:

- Unit / Integration / E2E → functional tests
- Smoke tests → basic “does app run?”
- Regression tests → ensure old features don’t break
- Performance tests → measure speed, scalability
- Security tests → check vulnerabilities

## 📘 Unit Testing Utilities – Vitest + React Testing Library

This document lists the commonly used functions, objects, and helpers you’ll encounter in unit tests, along with their usage and origin (Vitest, React Testing Library, or Jest-DOM).

---

## ⚡ From **Vitest**

### `test(name, fn)`

- Defines a test case.
- **Usage:**

```js
test('adds numbers correctly', () => { expect(1 + 2).toBe(3)
})
```

---

### `describe(name, fn)`

- Groups multiple related tests.
- **Usage:**
```js

describe('Math operations', () => { test('adds numbers', () => { expect(2 + 2).toBe(4)
  }) test('subtracts numbers', () => { expect(5 - 2).toBe(3)
  })
})

```

---

### `expect(value)`

- Used for assertions (to check outcomes).
- Works with **matchers** like `.toBe`, `.toEqual`, `.toContain`, etc.
- **Usage:**

```js
expect([1, 2, 3]).toContain(2)
```

---

### `vi`

- Vitest’s mocking/stubbing utility.
- Used to **mock functions, modules, timers, etc.**
- **Usage:**

```js

// Creating mock functions → to check how many times a function was called, with what arguments, etc.
// Mocking modules → to replace real API calls or utilities with fake ones in tests.
// Spying on functions → to see if a specific function was triggered.

const mockFn = vi.fn() mockFn('hello') expect(mockFn).toHaveBeenCalledWith('hello')
```

---

## ⚡ From **React Testing Library**

### `render(ui)`

- Renders a React component in a virtual DOM for testing.
- **Usage:**

```js
render(<Todo />)
```

---

### `screen`

- Provides access to queries for elements rendered with `render()`.
- Example queries:

  - `getByText`
  - `getByRole`
  - `getByPlaceholderText`
  - `findByText`

- **Usage:**

```js
render(<Todo />) const heading = screen.getByText(/Todo App/i) expect(heading).toBeInTheDocument()
```

---

### Queries from `screen`

- **`getBy...`** → Finds element immediately. Throws error if not found.

```js
screen.getByText(/Add/i)
```

- **`queryBy...`** → Returns element or `null`. Doesn’t throw error.

```js
expect(screen.queryByText(/Remove/i)).toBeNull()
```

- **`findBy...`** → Asynchronous. Waits until element appears (useful for API calls).

```js
const todo = await screen.findByText(/delectus aut autem/i)
```

---

### `fireEvent`

- Simulates user interactions (click, change, keyDown, etc.).
- **Usage:**

```js
const input = screen.getByPlaceholderText(/Enter your todo here/i)
fireEvent.change(input, { target: { value: 'New Task' } })
```

---

### `userEvent` (Optional, recommended)

- More realistic user interactions compared to `fireEvent`.
- Example:

```js
import userEvent from  '@testing-library/user-event'  const button = screen.getByText(/Add/i) await userEvent.click(button)
```

---

## ⚡ From **Jest-DOM** (extended matchers)

> Added automatically when you `import '@testing-library/jest-dom'` in `setupTests.js`.

- **`.toBeInTheDocument()`**  
  Checks if an element exists in the DOM.

```js
expect(screen.getByText(/Todo App/i)).toBeInTheDocument()
```

- **`.toHaveTextContent()`**  
  Checks element text.

```js
expect(screen.getByRole('button')).toHaveTextContent('Add')
```

- **`.toBeVisible()`**  
  Checks visibility.

```js
expect(screen.getByText(/Todo App/i)).toBeVisible()
```

- **`.toHaveAttribute(name, value)`**  
  Checks element attributes.


# this is me
  
```js
expect(screen.getByPlaceholderText(/Enter your todo/i)).toHaveAttribute('type', 'text')
```
