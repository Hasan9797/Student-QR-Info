import { eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { students } from '../db/partition.js'
import queryBuilder from '../helpers/queryBuilder.helper.js'
// import { welderCertificates } from "../db/schema.js";

async function ensureYearlyPartition(year) {
	const tableName = `students_${year}`
	await db.execute(
		sql.raw(`
    CREATE TABLE IF NOT EXISTS ${tableName} 
    PARTITION OF students 
    FOR VALUES FROM (${year}) TO (${year + 1});
  `),
	)
}

const getStudents = async (page, limit, params) => {
	const whereClause = queryBuilder.studentsWhereBuilder(params, students)
	const orderClause = queryBuilder.studentsSortBuilder(
		params?.sortBy,
		params?.order,
		students,
	)

	const [data, countResult] = await Promise.all([
		db
			.select()
			.from(students)
			.where(whereClause)
			.orderBy(orderClause)
			.limit(limit)
			.offset((page - 1) * limit),
		db
			.select({ total: sql`count(*)`.mapWith(Number) })
			.from(students)
			.where(whereClause),
	])

	return {
		data,
		pagination: {
			page: Number(page),
			limit: Number(limit),
			total: countResult[0]?.total ?? 0,
		},
	}
}

const getStudentById = async id => {
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
			// welderCertificate: {
			//   id: welderCertificates.id,
			//   certificatesName: welderCertificates.certificatesName,
			//   certificateNo: welderCertificates.certificateNo,
			//   introStatement: welderCertificates.introStatement,
			//   theoryGrade: welderCertificates.theoryGrade,
			//   practiceGrade: welderCertificates.practiceGrade,
			//   qualificationDetails: welderCertificates.qualificationDetails,
			//   issuanceBasis: welderCertificates.issuanceBasis,
			//   issuingBody: welderCertificates.issuingBody,
			//   city: welderCertificates.city,
			//   issueDate: welderCertificates.issueDate,
			//   expiryDate: welderCertificates.expiryDate,
			// },
		})
		.from(students)
		// .leftJoin(welderCertificates, eq(students.welderCertificateId, welderCertificates.id))
		.where(eq(students.id, id))
		.limit(1)

	return result[0] ?? null
}

const createStudent = async (requestData, currentYear) => {
  await ensureYearlyPartition(currentYear)
	const [student] = await db
		.insert(students)
		.values({
			...requestData,
			year: currentYear,
		})
		.returning()
	return student
}

const updateStudentById = async (id, data) => {
	const [updated] = await db
		.update(students)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(students.id, id))
		.returning()
	return updated
}

const deleteStudentById = async id => {
	const [deleted] = await db
		.delete(students)
		.where(eq(students.id, id))
		.returning()
	return deleted ?? null
}

const getMonthlyStats = async () => {
	const result = await db.execute(sql`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM') AS month,
      COUNT(*)::int AS total
    FROM students
    GROUP BY month
    ORDER BY month ASC
  `)
	return result.rows
}

export default {
	getStudents,
	getStudentById,
	createStudent,
	updateStudentById,
	deleteStudentById,
	getMonthlyStats,
}
