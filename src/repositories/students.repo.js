import { eq, sql, ilike, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { students } from "../db/schema.js";

/**
 * Talabalarni filtrlash va paginatsiya bilan olish
 */
const getStudents = async (page = 1, limit = 10, params) => {
  try {
    const conditions = [];

    if (params?.firstName) conditions.push(ilike(students.firstName, `%${params.firstName}%`));
    if (params?.lastName) conditions.push(ilike(students.lastName, `%${params.lastName}%`));
    if (params?.specialty) conditions.push(ilike(students.specialty, `%${params.specialty}%`));
    if (params?.passportNumber) conditions.push(ilike(students.passportNumber, `%${params.passportNumber}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db.select().from(students)
        .where(whereClause)
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: sql`count(*)`.mapWith(Number) })
        .from(students)
        .where(whereClause),
    ]);

    return {
      data,
      pagination: { 
        page: Number(page), 
        limit: Number(limit), 
        total: countResult[0]?.total ?? 0 
      },
    };
  } catch (error) {
    throw error; // Global handlerga uzatish
  }
};

/**
 * ID bo'yicha bitta talabani topish
 */
const getStudentById = async (id) => {
  try {
    const student = await db.select().from(students).where(eq(students.id, id)).limit(1);
    
    if (!student.length) {
      const error = new Error("Talaba topilmadi");
      error.code = 404; // Biz yozgan errorHandler buni NOT_FOUND qiladi
      throw error;
    }

    return student[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Yangi talaba qo'shish
 */
const createStudent = async (data) => {
  // Drizzle xato bersa, u avtomatik ravishda yuqoriga otiladi
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

/**
 * Talabani o'chirish
 */
const deleteStudentById = async (id) => {
  try {
    const [deleted] = await db.delete(students).where(eq(students.id, id)).returning();
    
    if (!deleted) {
      const error = new Error("O'chirish uchun talaba topilmadi");
      error.code = 404;
      throw error;
    }

    return deleted;
  } catch (error) {
    throw error;
  }
};

export default { 
  getStudents, 
  getStudentById, 
  createStudent, 
  updateStudentById, 
  deleteStudentById 
};