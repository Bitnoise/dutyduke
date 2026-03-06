import { type EmployeesPhotosRepository } from '@/api/hris/employees/model/repositories';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export function employeesPhotosRepository(db: OrganizationPrismaClient): EmployeesPhotosRepository {
  const createEmployeePhoto = async (employeeId: CUID, photoId: CUID) => {
    await db.employee.update({
      where: { id: employeeId },
      data: { photosIds: { push: photoId } },
    });
  };

  const updateEmployeePhotos = async (employeeId: CUID, photoIds: CUID[]) => {
    await db.employee.update({
      where: { id: employeeId },
      data: { photosIds: { set: photoIds } },
    });
  };

  const deleteAllEmployeePhotos = async (employeeId: CUID) => {
    await db.employee.update({ where: { id: employeeId }, data: { photosIds: [] } });
  };

  const setEmployeeAvatar = async (employeeId: CUID, photoId: CUID) => {
    await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        avatarId: photoId,
      },
    });
  };

  const unsetEmployeeAvatar = async (employeeId: CUID) => {
    await db.employee.update({
      where: { id: employeeId },
      data: {
        avatarId: null,
      },
    });
  };

  return {
    createEmployeePhoto,
    deleteAllEmployeePhotos,
    updateEmployeePhotos,
    setEmployeeAvatar,
    unsetEmployeeAvatar,
  };
}
