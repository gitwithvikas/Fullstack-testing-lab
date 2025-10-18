
import { render, screen, fireEvent} from '@testing-library/react'
import { test, expect,vi, beforeEach, afterEach } from 'vitest'

import Todo from '../Components/Todo'



// Unit testing 

test('heading should be there', () => {
      render(<Todo/>)
      expect(screen.getByText(/Todo App/i)).toBeInTheDocument()
})


test('redners todo input',()=>{
    render(<Todo/>)
    const input = screen.getByPlaceholderText(/Enter your todo here/i)
    expect(input).toBeInTheDocument()

})

test('Button shouud be present',()=>{
    render(<Todo/>)
    const button = screen.getByText(/Add/i)
    expect(button).toBeInTheDocument()
})


test('Todo should be added',()=>{
    render(<Todo/>) 
    const input = screen.getByPlaceholderText(/Enter your todo here/i)
    const button = screen.getByText(/Add/i)
    fireEvent.change(input,{target:{value:'test'}})
    fireEvent.click(button)
    expect(screen.getByText(/test/i)).toBeInTheDocument()
})  


// Interaction testing



test("user can add a todo and see it in TodoList", () => {
  render(<Todo />);

  // Find input and button
  const input = screen.getByPlaceholderText(/Enter your todo here/i);
  const button = screen.getByText(/Add/i);

  // Type a todo and click Add
  fireEvent.change(input, { target: { value: "Buy Milk" } });
  fireEvent.click(button);

  // ✅ Integration part: check child component <TodoList /> rendered it
  expect(screen.getByText(/Buy Milk/i)).toBeInTheDocument();
});


// +++++++++++++++++++++++++++++++++++++++

//  test with api but mock test( without real data mock(like dummy))

// Before each test, mock fetch
beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, title: "Learn React" },
          { id: 2, title: "Write Tests" },
        ]),
    })
  );
});

afterEach(() => {
  vi.clearAllMocks();
});



test("loads and displays todos from API", async () => {
 
  render(<Todo />);

  // wait untill api call 
  const todos = await screen.findAllByTestId("todo-item");
  expect(todos).toHaveLength(2);
  expect(todos[0]).toHaveTextContent("Learn React");
  expect(todos[1]).toHaveTextContent("Write Tests");

    // verify API was called correctly
  expect(fetch).toHaveBeenCalledWith(
    "https://jsonplaceholder.typicode.com/todos?_limit=10"
  );

});

test("adds a new todo with the button", async () => {
  render(<Todo />);

  // wait for initial todos
  await screen.findAllByTestId("todo-item");

  const input = screen.getByPlaceholderText(/Enter your todo here/i);
  const button = screen.getByText(/Add/i);

  fireEvent.change(input, { target: { value: "New Todo" } });
  fireEvent.click(button);

  expect(screen.getByText("New Todo")).toBeInTheDocument();
});

test("adds a new todo with Enter key", async () => {
  render(<Todo />);

  await screen.findAllByTestId("todo-item");

  const input = screen.getByPlaceholderText(/Enter your todo here/i);

  fireEvent.change(input, { target: { value: "Another Todo" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  expect(screen.getByText("Another Todo")).toBeInTheDocument();
});