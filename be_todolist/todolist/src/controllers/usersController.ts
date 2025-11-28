  // src/controllers/usersController.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";

// Lấy tất cả user
export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Lấy user theo id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await db.select().from(users).where(eq(users.id, id));
    res.json(user[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Tạo mới user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const [newUser] = await db.insert(users).values({ name, email, password }).returning();
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Cập nhật user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({ name, email, password, updatedAt: new Date() }) // chú ý: updatedAt
      .where(eq(users.id, id))
      .returning();

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Xóa user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(users).where(eq(users.id, id));
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
