
export default function TodoList({todos}){
    return <>
    
     <div className="mt-4  w-[80%] flex flex-col gap-3 justify-center">
                {todos?.map((todo, index) => {
                    return <div data-testid='todo-item' key={index} className="flex flex-row items-center gap-2 p-4 bg-gray-100 rounded-md ">
                        <p key={index}>{todo.title}</p>
                    </div>
                })}
            </div>

    </>
}