import { eq, sql, ilike, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { students, welderCertificates } from "../db/schema.js";

const getStudents = async (page = 1, limit = 10, params) => {
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
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: countResult[0]?.total ?? 0,
    },
  };
};

const getStudentById = async (id) => {
  const result = await db
    .select({
      id: students.id,
      given: students.given,
      lastName: students.lastName,
      firstName: students.firstName,
      patronymic: students.patronymic,
      specialty: students.specialty,
      qualification: students.qualification,
      birthDate: students.birthDate,
      passportNumber: students.passportNumber,
      certificateNumber: students.certificateNumber,
      protocolNumber: students.protocolNumber,
      protocolRegistrationDate: students.protocolRegistrationDate,
      commissionChairman: students.commissionChairman,
      photo: students.photo,
      createdAt: students.createdAt,
      updatedAt: students.updatedAt,
      welderCertificate: {
        id: welderCertificates.id,
        certificateNo: welderCertificates.certificateNo,
        introStatement: welderCertificates.introStatement,
        theoryGrade: welderCertificates.theoryGrade,
        practiceGrade: welderCertificates.practiceGrade,
        qualificationDetails: welderCertificates.qualificationDetails,
        issuanceBasis: welderCertificates.issuanceBasis,
        issuingBody: welderCertificates.issuingBody,
        city: welderCertificates.city,
        issueDate: welderCertificates.issueDate,
        expiryDate: welderCertificates.expiryDate,
      },
    })
    .from(students)
    .leftJoin(welderCertificates, eq(students.welderCertificateId, welderCertificates.id))
    .where(eq(students.id, id))
    .limit(1);

  return result[0] ?? null;
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
  const [deleted] = await db.delete(students).where(eq(students.id, id)).returning();
  return deleted ?? null;
};

export default {
  getStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
};
