import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todoService';
import { CreateTodoInput, UpdateTodoInput } from '../types/todo';

export const useTodos = (userId: string) => {
  return useQuery({
    queryKey: ['todos', userId],
    queryFn: () => todoService.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useTodo = (userId: string, taskId: string) => {
  return useQuery({
    queryKey: ['todos', userId, taskId],
    queryFn: () => todoService.getById(userId, taskId),
    enabled: !!userId && !!taskId,
  });
};

export const useCreateTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoService.create(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    },
  });
};

export const useUpdateTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTodoInput }) =>
      todoService.update(userId, taskId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
      queryClient.invalidateQueries({ queryKey: ['todos', userId, variables.taskId] });
    },
  });
};

export const useDeleteTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => todoService.delete(userId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    },
  });
};

export const useToggleTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => todoService.toggleStatus(userId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    },
  });
};

