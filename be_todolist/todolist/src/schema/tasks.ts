import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
  due_date: timestamp("due_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
