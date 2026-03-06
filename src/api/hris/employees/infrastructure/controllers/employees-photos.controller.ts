import { documentsAcl } from '@/api/hris/employees/infrastructure/acl/documents.acl';
import { type OrganizationContext } from '@/api/hris';
import { type UpdateEmployeePhotoSchema } from '@/api/hris/employees/infrastructure/controllers/schemas';
import { employeesPhotosRepository } from '@/api/hris/employees/infrastructure/database/repositories';
import { ApiError, type CUID } from '@/shared';
import { setEmployeeAvatarUseCase, updateEmployeePhotosUseCase } from '@/api/hris/employees/model/use-cases';
import { type EmployeePhotoDto } from '@/api/hris/employees/model/dtos';
import { isOwnerRoute, type PermissionChecker } from '@/api/hris/authorization';
import {
  employeeQueries,
  employeesPhotosQueries,
} from '@/api/hris/employees/infrastructure/database/queries';
import { EMPLOYEE_PHOTOS_ERROR_MESSAGES } from '@/api/hris/employees/errors';

export type EmployeesPhotosController = {
  updateEmployeePhotos: (employeeId: CUID, photos: UpdateEmployeePhotoSchema[]) => Promise<void>;
  getEmployeeAvatar: (employeeId: CUID) => Promise<CUID | null>;
  setEmployeeAvatar: (employeeId: CUID, photoId: CUID) => Promise<void>;
  getEmployeePhoto: (photoId: CUID) => Promise<EmployeePhotoDto>;
};

export function employeesPhotosController(
  organizationContext: OrganizationContext,
): EmployeesPhotosController {
  const employeeQueriesInstance = employeeQueries(organizationContext);

  const employeesPhotosRepositoryImpl = employeesPhotosRepository(organizationContext.db);
  const employeesPhotosQueriesImpl = employeesPhotosQueries(organizationContext.db);
  const documentsAclImpl = documentsAcl(organizationContext);

  const updateEmployeePhotos = async (
    checker: PermissionChecker,
    employeeId: CUID,
    photos: UpdateEmployeePhotoSchema[],
  ) => {
    const employee = await employeeQueriesInstance.getEmployeeById(employeeId);

    const oldPhotos = await Promise.all(
      employee?.photosIds.map((photoId) => documentsAclImpl.getDocumentById(photoId)) || [],
    );

    await updateEmployeePhotosUseCase(employeesPhotosRepositoryImpl, documentsAclImpl)(
      employeeId,
      photos,
      employee?.photosIds.find((photoId) => photoId === employee.avatarId) ?? null,
      oldPhotos,
    );
  };

  const setEmployeeAvatar = async (checker: PermissionChecker, employeeId: CUID, photoId: CUID) => {
    const currentEmployeeAvatarId = await employeesPhotosQueriesImpl.getEmployeeAvatar(employeeId);

    await setEmployeeAvatarUseCase(employeesPhotosRepositoryImpl)(
      employeeId,
      photoId,
      currentEmployeeAvatarId,
    );
  };

  const getEmployeePhoto = async (checker: PermissionChecker, photoId: CUID) => {
    const photo = await documentsAclImpl.getDocumentById(photoId);

    if (!photo) throw new ApiError(404, EMPLOYEE_PHOTOS_ERROR_MESSAGES.PHOTO_NOT_FOUND(photoId));

    return photo;
  };

  return {
    updateEmployeePhotos: isOwnerRoute(updateEmployeePhotos),
    setEmployeeAvatar: isOwnerRoute(setEmployeeAvatar),
    getEmployeeAvatar: isOwnerRoute(async (checker: PermissionChecker, employeeId: CUID) => {
      return employeesPhotosQueriesImpl.getEmployeeAvatar(employeeId);
    }),
    getEmployeePhoto: isOwnerRoute(getEmployeePhoto),
  };
}
