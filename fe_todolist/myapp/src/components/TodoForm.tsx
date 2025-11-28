import React, { useState } from "react";
import { useCreateTodo } from "../hooks/useTodos";

const statusOptions = [
  { value: "open", label: "Đang mở" },
  { value: "in_progress", label: "Đang làm" },
  { value: "done", label: "Hoàn thành" },
];

const toISODate = (value: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return date.toISOString();
};

interface TodoFormProps {
  userId: string;
  onSuccess?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ userId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [dueDate, setDueDate] = useState("");
  const createTodo = useCreateTodo(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTodo.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      due_date: toISODate(dueDate),
    });

    setTitle("");
    setDescription("");
    setStatus("open");
    setDueDate("");
    onSuccess?.();
  };

  if (!userId) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl mb-6">
        <p className="font-semibold">⚠️ Vui lòng chọn một user để thêm task!</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        ➕ Thêm Task Mới
      </h2>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tiêu đề *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Nhập tiêu đề task..."
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mô tả
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Nhập mô tả task..."
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Trạng thái
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Hạn hoàn thành
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={createTodo.isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md"
      >
        {createTodo.isPending ? "⏳ Đang thêm..." : "➕ Thêm Task"}
      </button>
    </form>
  );
};
