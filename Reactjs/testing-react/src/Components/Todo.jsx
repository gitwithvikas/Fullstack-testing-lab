import { useEffect, useState } from "react";
import TodoList from "./TodoList";


export default function Todo() {

    const [todos, setTodos] = useState([]);
    const [todoValue, setTodoValue] = useState('');

     
    useEffect(()=>{
        // only 10 todos
        fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
        .then(res=>res.json())
        .then(data=>setTodos(data))
        .catch(err=>console.log(err))
    },[])

    console.log(todos)


    const addTodo = (e) => {
        
        e.preventDefault();
        const todo = todoValue.trim();
        const newTodos = {title:todo}
        setTodos([...todos, newTodos]);
        e.target.value = '';

        
    }

    const handleKeyDown = (e)=>{
        console.log(e.key)
        if(e.key === 'Enter'){
            addTodo(e)
        }
    }



    return <>

        <div className="flex flex-col p-4">


            <div className="flex flex-col items-center gap-3 mt-4">

                <h1 className="text-3xl font-bold">Todo App</h1>

                <input onKeyDown={(e)=>handleKeyDown(e)} onChange={(e) => setTodoValue(e.target.value)} type="text" placeholder="Enter your todo here" className="border-1 border-gray-300 rounded-md p-2 outline-none" />

                <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-md">Add</button>

            </div>


           <TodoList todos={todos}/>
        </div>




    </>
}