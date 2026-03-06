import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { EMPLOYEE_PHOTOS_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type DocumentsAcl } from '@/api/hris/employees/model/acl';
import { type UpdateEmployeePhotoDto } from '@/api/hris/employees/model/dtos';
import { type EmployeesPhotosRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type Nullable, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function updateEmployeePhotosUseCase(
  repository: EmployeesPhotosRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (
    employeeId: CUID,
    newPhotos: UpdateEmployeePhotoDto[],
    avatarId: Nullable<string>,
    oldPhotos?: Nullable<DocumentDto>[],
  ) => {
    await repository.deleteAllEmployeePhotos(employeeId);

    if (!newPhotos.length) {
      const oldPhotosIds = oldPhotos
        ?.filter((photo): photo is DocumentDto => photo !== null)
        .map((photo) => photo.id) as CUID[];

      await repository.unsetEmployeeAvatar(employeeId);
      await documentsAcl.deleteEmployeeDocuments(oldPhotosIds);
      await documentsAcl.deleteEmployeeDirectory(`photos/${employeeId}`, true);

      return;
    }

    const newPhotoFileIds = Array.from(
      new Set(newPhotos.filter((photo) => 'id' in photo).map((photo) => photo.id)),
    );

    const idsToLeave: string[] = [];
    const idsToDelete: string[] = [];

    oldPhotos?.map((oldPhoto) =>
      oldPhoto && !newPhotoFileIds.includes(oldPhoto.id)
        ? idsToDelete.push(oldPhoto.id)
        : oldPhoto && idsToLeave.push(oldPhoto.id),
    );

    if (oldPhotos?.length) {
      try {
        await documentsAcl.deleteEmployeeDocuments(idsToDelete);
      } catch (err) {
        logger.info(err);
        throw new ApiError(400, EMPLOYEE_PHOTOS_ERROR_MESSAGES.UPDATE_FAILED);
      }
    }

    await Promise.all(idsToLeave.map((id) => repository.createEmployeePhoto(employeeId, id)));

    for (const photo of newPhotos) {
      if ('id' in photo) {
        try {
          const newAvatarId = idsToLeave.find((id) => id === avatarId);

          if (newAvatarId) {
            await repository.setEmployeeAvatar(employeeId, newAvatarId);
          }
        } catch (err) {
          await documentsAcl.deleteDocumentById(photo.id);

          logger.error(err);
          throw new ApiError(400, EMPLOYEE_PHOTOS_ERROR_MESSAGES.UPDATE_FAILED);
        }
      }

      if ('file' in photo) {
        const id = await documentsAcl.uploadEmployeeDocument(photo.file, `photos/${employeeId}`);
        if (!id) {
          throw new ApiError(400, EMPLOYEE_PHOTOS_ERROR_MESSAGES.UPDATE_FAILED);
        }

        try {
          await repository.createEmployeePhoto(employeeId, id);
        } catch (err) {
          await documentsAcl.deleteDocumentById(id);

          logger.error(err);
          throw new ApiError(400, EMPLOYEE_PHOTOS_ERROR_MESSAGES.UPDATE_FAILED);
        }
      }
    }
  };
}
