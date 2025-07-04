import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function Todos() {
  const [textTodos, setTextTodos] = useState("");
  const queryClient = useQueryClient();
  //   const fetchTodos = async () => {
  //     const response = await fetch("http://localhost:3000/todos");
  //     return response.json();
  //   };
  const { isLoading, error, data, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () =>
      await fetch("http://localhost:3000/todos").then((res) => res.json()),
    staleTime: 1000 * 60,
  });

  const postTodo = async (newTodo) => {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    return response.json();
  };

  const addMutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = async (id) => {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    return response.json();
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return "Loading...";

  if (isError) return "An error has occurred: " + error.message;

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!textTodos.trim()) return;

    const newTodo = {
      text: textTodos,
    };

    addMutation.mutate(newTodo);
    setTextTodos("");
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] max-w-md">
        <form onSubmit={handleAddTodo}>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter your todo"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={textTodos}
              onChange={(e) => setTextTodos(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Add
            </button>
          </div>
        </form>

        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <p className="text-gray-800">{item.text}</p>
            <button
              onClick={() => deleteMutation.mutate(item.id)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todos;
