import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { UserList } from './components/UserList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              📝 Todo List App
            </h1>
            <p className="text-gray-600 text-lg">
              Quản lý công việc của bạn một cách hiệu quả
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - User Management */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  👥 Quản lý Users
                </h2>
                <UserList
                  selectedUserId={selectedUserId}
                  onSelectUser={setSelectedUserId}
                />
              </div>
            </div>

            {/* Main Content - Tasks */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <TodoForm userId={selectedUserId} />
                <TodoList userId={selectedUserId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
