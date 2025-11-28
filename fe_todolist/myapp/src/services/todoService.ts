import { apiClient } from '../config/api';
import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

export const todoService = {
  getByUserId: async (userId: string): Promise<Todo[]> => {
    return apiClient<Todo[]>(`/api/tasks/${userId}`);
  },

  getById: async (userId: string, taskId: string): Promise<Todo> => {
    const tasks = await todoService.getByUserId(userId);
    const task = tasks.find(t => String(t.id) === String(taskId));
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  create: async (userId: string, input: CreateTodoInput): Promise<Todo> => {
    return apiClient<Todo>(`/api/tasks/${userId}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update: async (userId: string, taskId: string, input: UpdateTodoInput): Promise<Todo> => {
    return apiClient<Todo>(`/api/tasks/${userId}/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  delete: async (userId: string, taskId: string): Promise<void> => {
    return apiClient<void>(`/api/tasks/${userId}/${taskId}`, {
      method: 'DELETE',
    });
  },

  toggleStatus: async (userId: string, taskId: string): Promise<Todo> => {
    const task = await todoService.getById(userId, taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    const nextStatus = task.status === 'done' ? 'open' : 'done';
    return todoService.update(userId, taskId, { status: nextStatus });
  },
};

