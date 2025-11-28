import { apiClient } from '../config/api';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';

export const userService = {
  getAll: async (): Promise<User[]> => {
    return apiClient<User[]>('/api/users');
  },

  getById: async (id: string): Promise<User> => {
    return apiClient<User>(`/api/users/${id}`);
  },

  create: async (input: CreateUserInput): Promise<User> => {
    return apiClient<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update: async (id: string, input: UpdateUserInput): Promise<User> => {
    return apiClient<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

