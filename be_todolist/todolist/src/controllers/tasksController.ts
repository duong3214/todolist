import { Request, Response } from "express";
import * as tasksService from "../services/tasksService";

interface CreateTaskBody {
  title: string;
  description?: string;
  due_date?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: string;
  due_date?: string;
}

// Lấy danh sách tasks của user
export const getTasks = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const tasks = await tasksService.getTasksByUserId(userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Tạo task mới cho user
export const createTask = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { title, description, due_date } = req.body as CreateTaskBody;

  try {
    const newTask = await tasksService.createTask({
      user_id: userId,
      title,
      description,
      due_date: due_date ? new Date(due_date) : undefined,
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const updateTask = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.taskId);
  const { title, description, status, due_date } = req.body as UpdateTaskBody;

  try {
    const updatedTask = await tasksService.updateTask(taskId, userId, {
      title,
      description,
      status,
      due_date: due_date ? new Date(due_date) : undefined,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or not yours" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Xóa task của user
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const taskId = Number(req.params.taskId);
    const deletedCount = await tasksService.deleteTask(taskId, userId);
    if (deletedCount) {
      res.json({ message: "Task deleted" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
