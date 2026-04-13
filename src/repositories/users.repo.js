import { and, gte, lte, ilike, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import queryBuilderHelper from "../helpers/queryBuilder.helper.js";

const getUsers = async (page, limit, queryParams) => {
  const offset = (page - 1) * limit;

  let findAllQuery = db
    .select({ id: users.id, name: users.name, role: users.role, login: users.login })
    .from(users)
    .limit(limit)
    .offset(offset);

  let countQuery = db.select({ count: sql`count(*)` }).from(users);

  if (queryParams && Object.keys(queryParams).length > 0) {
    const sqlQuery = queryBuilderHelper.usersWhereBuilder(queryParams);

    findAllQuery = findAllQuery.where(sqlQuery);
    countQuery = countQuery.where(sqlQuery);
  }

  const [data, countResult] = await Promise.all([findAllQuery, countQuery]);

  const total = Number(countResult[0]?.count) || 0;

  return {
    data,
    pagination: { page, limit, total },
  };
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
