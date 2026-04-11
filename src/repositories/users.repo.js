import { and, gte, lte, ilike, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const getUsers = async (query) => {
  const { page = 1, limit = 10, ...filters } = query;
  const offset = (page - 1) * limit;

  const where = and(
    filters.login ? ilike(users.login, `%${filters.login}%`) : null,
    filters.role ? eq(users.role, filters.role) : null,
    filters.createdAt ? gte(users.createdAt, filters.createdAt) : null,
  );

  const data = await db
    .select("id", "name", "role", "login")
    .from(users)
    .where(where)
    .limit(limit)
    .offset(offset)
    .all();

  const count = await db.select({ count: users.id }).from(users).where(where).all();

  return { data, pagination: { page, limit, total: count[0].count } };
};

const getUser = async (userId) => {
  return await db.select().from(users).where(eq(users.id, userId)).get();
};

const getByLogin = async (login) => {
  return await db.select().from(users).where(eq(users.login, login)).get();
};

const createUser = async (data) => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
};

const updateUserById = async (id, data) => {
  const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updatedUser;
};

const deleteUserById = async (id) => {
  await db.delete(users).where(eq(users.id, id));
};

export default { getUsers, getUser, getByLogin, createUser, updateUserById, deleteUserById };
