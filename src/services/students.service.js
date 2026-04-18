import { CustomError } from "../errors/custom.error.js";
import studentsRepo from "../repositories/students.repo.js";
// import welderCertificatesRepo from "../repositories/welder-certificates.repo.js";

const getStudents = async (page, limit, queryParams) => {
  const params = Object.keys(queryParams).length > 0 ? queryParams : null;
  return await studentsRepo.getStudents(page, limit, params);
};

const getStudentById = async (id) => {
  const student = await studentsRepo.getStudentById(id);
  if (!student) throw CustomError.notFoundError(`Student with ID ${id} not found`);
  return student;
};

const createStudent = async (data) => {
  // if (data.welderCertificateId) {
  //   const certificate = await welderCertificatesRepo.getById(data.welderCertificateId);
  //   if (!certificate) throw CustomError.notFoundError(`Welder certificate with ID ${data.welderCertificateId} not found`);
  // }
  return await studentsRepo.createStudent(data);
};

const updateStudent = async (id, data) => {
  const student = await studentsRepo.getStudentById(id);
  if (!student) throw CustomError.notFoundError(`Student with ID ${id} not found`);

  // if (data.welderCertificateId) {
  //   const certificate = await welderCertificatesRepo.getById(data.welderCertificateId);
  //   if (!certificate) throw CustomError.notFoundError(`Welder certificate with ID ${data.welderCertificateId} not found`);
  // }

  return await studentsRepo.updateStudentById(id, data);
};

const deleteStudent = async (id) => {
  const student = await studentsRepo.getStudentById(id);
  if (!student) throw CustomError.notFoundError(`Student with ID ${id} not found`);
  await studentsRepo.deleteStudentById(id);
};

export default { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
