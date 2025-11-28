export interface Todo {
  id: string | number;
  userId?: string | number;
  user_id?: string | number;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  dueDate?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status: string;
  due_date?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: string;
  due_date?: string;
}

