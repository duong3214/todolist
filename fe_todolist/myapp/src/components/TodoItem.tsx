import React, { useMemo, useState } from "react";
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from "../hooks/useTodos";
import { Todo } from "../types/todo";

const statusOptions = [
  { value: "open", label: "Đang mở" },
  { value: "in_progress", label: "Đang làm" },
  { value: "done", label: "Hoàn thành" },
];

interface TodoItemProps {
  todo: Todo;
  userId: string;
}

const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const toISODate = (value: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return date.toISOString();
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [status, setStatus] = useState(todo.status || "open");
  const [dueDate, setDueDate] = useState(
    toDateInputValue(todo.due_date ?? todo.dueDate)
  );

  const createdAt = todo.createdAt ?? todo.created_at;
  const dueDateValue = todo.due_date ?? todo.dueDate;

  const updateTodo = useUpdateTodo(userId);
  const deleteTodo = useDeleteTodo(userId);
  const toggleTodo = useToggleTodo(userId);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTodo.mutateAsync({
      taskId: String(todo.id),
      input: {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        due_date: toISODate(dueDate),
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa task này?")) {
      await deleteTodo.mutateAsync(String(todo.id));
    }
  };

  const handleToggle = async () => {
    await toggleTodo.mutateAsync(String(todo.id));
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue =
    dueDateValue &&
    new Date(dueDateValue) < new Date() &&
    todo.status !== "done";

  const statusBadge = useMemo(() => {
    switch (todo.status) {
      case "done":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }, [todo.status]);

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="bg-white p-4 rounded-xl shadow-lg border-2 border-blue-500"
      >
        <div className="mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tiêu đề"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả"
            rows={2}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hạn hoàn thành
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updateTodo.isPending}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-semibold transition-all"
          >
            💾 Lưu
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setTitle(todo.title);
              setDescription(todo.description || "");
              setStatus(todo.status || "open");
              setDueDate(toDateInputValue(dueDateValue));
            }}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-semibold transition-all"
          >
            Hủy
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md border-l-4 transition-all hover:shadow-lg ${
        todo.status === "done"
          ? "border-green-500 opacity-80"
          : isOverdue
          ? "border-red-500"
          : "border-blue-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.status === "done"}
          onChange={handleToggle}
          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${
              todo.status === "done"
                ? "line-through text-gray-500"
                : "text-gray-800"
            }`}
          >
            {todo.title}
          </h3>
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${statusBadge}`}
          >
            {statusOptions.find((option) => option.value === todo.status)
              ?.label || todo.status}
          </span>
          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.status === "done" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {todo.description}
            </p>
          )}
          {dueDateValue && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">⏰</span>
              <span
                className={`text-xs ${
                  isOverdue ? "text-red-600 font-semibold" : "text-gray-600"
                }`}
              >
                {formatDateTime(dueDateValue)}
                {isOverdue && " (Quá hạn)"}
              </span>
            </div>
          )}
          {createdAt && (
            <div className="mt-2 text-xs text-gray-400">
              Tạo: {formatDateTime(createdAt)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            ✏️ Sửa
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors font-semibold"
          >
            🗑️ Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
