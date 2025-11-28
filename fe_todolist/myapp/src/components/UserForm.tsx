import React, { useState } from 'react';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { User, CreateUserInput } from '../types/user';

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEditing = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (isEditing) {
      await updateUser.mutateAsync({
        id: user.id,
        input: { name: name.trim(), email: email.trim() },
      });
    } else {
      await createUser.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });
    }

    setName('');
    setEmail('');
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {isEditing ? '✏️ Sửa User' : '➕ Thêm User Mới'}
      </h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Nhập tên user..."
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Nhập email user..."
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={createUser.isPending || updateUser.isPending}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md"
        >
          {createUser.isPending || updateUser.isPending
            ? 'Đang xử lý...'
            : isEditing
            ? '💾 Lưu thay đổi'
            : '➕ Thêm User'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-semibold"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

