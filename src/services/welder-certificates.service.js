import { CustomError } from "../errors/custom.error.js";
import welderCertificatesRepo from "../repositories/welder-certificates.repo.js";
import { welderStatus } from "../enums/welder.enum.js";

const getAll = async (page, limit, queryParams) => {
  const params = Object.keys(queryParams).length > 0 ? queryParams : null;
  return await welderCertificatesRepo.getAll(page, limit, params);
};

const getById = async (id) => {
  const certificate = await welderCertificatesRepo.getById(id);
  if (!certificate) throw CustomError.notFoundError(`Welder certificate with ID ${id} not found`);
  return certificate;
};

const getActive = async () => {
  return await welderCertificatesRepo.getActive();
};

const create = async (data) => {
  return await welderCertificatesRepo.create({ ...data, status: welderStatus.INACTIVE });
};

const update = async (id, data) => {
  await getById(id);
  const { status, ...rest } = data;
  const updateData = { ...rest };
  if (status !== undefined) {
    if (status !== welderStatus.ACTIVE && status !== welderStatus.INACTIVE) {
      throw CustomError.badRequestError("Invalid status value. Use 1 (active) or 0 (inactive)");
    }
    updateData.status = status;
  }
  return await welderCertificatesRepo.updateById(id, updateData);
};

const remove = async (id) => {
  await getById(id);
  await welderCertificatesRepo.deleteById(id);
};

export default { getAll, getById, getActive, create, update, remove };
