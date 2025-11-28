import React, { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  userId: string;
}

export const TodoList: React.FC<TodoListProps> = ({ userId }) => {
  const { data: todos, isLoading, error } = useTodos(userId);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  if (!userId) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 px-6 py-8 rounded-xl text-center">
        <p className="text-lg font-semibold">
          👆 Vui lòng chọn một user để xem danh sách tasks!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600 font-semibold">Đang tải tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
        <p className="font-semibold">
          ❌ Lỗi khi tải danh sách task: {error.message}
        </p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg font-semibold">
          📝 Chưa có task nào. Hãy thêm task mới!
        </p>
      </div>
    );
  }

  const filteredTodos = todos.filter((todo: Todo) => {
    const isCompleted = todo.status === "done";
    if (filter === "active") return !isCompleted;
    if (filter === "completed") return isCompleted;
    return true;
  });

  const activeCount = todos.filter(
    (todo: Todo) => todo.status !== "done"
  ).length;
  const completedCount = todos.filter(
    (todo: Todo) => todo.status === "done"
  ).length;

  return (
    <div>
      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tất cả ({todos.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "active"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Chưa hoàn thành ({activeCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Đã hoàn thành ({completedCount})
        </button>
      </div>

      <div className="space-y-3">
        {filteredTodos.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} userId={userId} />
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">
            {filter === "active"
              ? "Không có task chưa hoàn thành"
              : filter === "completed"
              ? "Không có task đã hoàn thành"
              : "Không có task nào"}
          </p>
        </div>
      )}
    </div>
  );
};
