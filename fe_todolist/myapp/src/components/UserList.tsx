import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { User } from '../types/user';
import { UserForm } from './UserForm';

interface UserListProps {
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ selectedUserId, onSelectUser }) => {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này? Tất cả tasks của user sẽ bị xóa.')) {
      await deleteUser.mutateAsync(id);
      if (selectedUserId === id) {
        onSelectUser('');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Đang tải users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Lỗi khi tải danh sách users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showForm && !editingUser && (
        <UserForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onSuccess={() => {
            setEditingUser(undefined);
            setShowForm(false);
          }}
          onCancel={() => {
            setEditingUser(undefined);
            setShowForm(false);
          }}
        />
      )}

      {!showForm && !editingUser && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-semibold shadow-lg"
        >
          ➕ Thêm User Mới
        </button>
      )}

      {users && users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user: User) => (
            <div
              key={user.id}
              className={`bg-white p-4 rounded-lg shadow-md border-2 transition-all cursor-pointer ${
                selectedUserId === user.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectUser(user.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUser(user);
                      setShowForm(false);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors font-semibold"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    disabled={deleteUser.isPending}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-semibold"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
              {selectedUserId === user.id && (
                <div className="mt-2 text-xs text-blue-600 font-semibold">
                  ✓ Đang chọn
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Chưa có user nào. Hãy thêm user mới!</p>
          </div>
        )
      )}
    </div>
  );
};

