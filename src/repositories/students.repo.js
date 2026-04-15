import { eq, sql, ilike, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { students } from "../db/schema.js";

const getStudents = async (page, limit, params) => {
  const conditions = [];

  if (params?.firstName) conditions.push(ilike(students.firstName, `%${params.firstName}%`));
  if (params?.lastName) conditions.push(ilike(students.lastName, `%${params.lastName}%`));
  if (params?.specialty) conditions.push(ilike(students.specialty, `%${params.specialty}%`));
  if (params?.passportNumber) conditions.push(ilike(students.passportNumber, `%${params.passportNumber}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db.select().from(students).where(whereClause).limit(limit).offset((page - 1) * limit),
    db.select({ total: sql`count(*)`.mapWith(Number) }).from(students).where(whereClause),
  ]);

  return {
    data,
    pagination: { page, limit, total: countResult[0]?.total ?? 0 },
  };
};

const getStudentById = async (id) => {
  return await db.query.students.findFirst({
    where: eq(students.id, id),
  });
};

const createStudent = async (data) => {
  const [student] = await db.insert(students).values(data).returning();
  return student;
};

const updateStudentById = async (id, data) => {
  const [updated] = await db
    .update(students)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(students.id, id))
    .returning();
  return updated;
};

const deleteStudentById = async (id) => {
  await db.delete(students).where(eq(students.id, id));
};

export default { getStudents, getStudentById, createStudent, updateStudentById, deleteStudentById };
