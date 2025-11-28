import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../schema/users";

// Lấy user theo id
export const getUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
};

// Cập nhật user
export const updateUser = async (id: number, data: { name?: string; email?: string; password?: string }) => {
  const [updatedUser] = await db.update(users)
    .set({ ...data, updatedAt: new Date() }) 
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

// Xóa user
export const deleteUser = async (id: number) => {
  await db.delete(users).where(eq(users.id, id));
  return { message: "User deleted" };
};
