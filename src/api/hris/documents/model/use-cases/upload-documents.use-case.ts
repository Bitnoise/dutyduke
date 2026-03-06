import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';
import { type DocumentsCategoryRepository, type DocumentsRepository } from '../repositories';

export function uploadDocumentsUseCase(
  repository: DocumentsRepository,
  categoryRepository: DocumentsCategoryRepository,
  service: FilePersistenceServiceType,
) {
  return async (
    organizationId: CUID,
    files: File[],
    dirPath: string,
    assignedTo?: string,
  ): Promise<CUID[]> => {
    const filePaths = await Promise.all(
      files.map((file) => service.uploadFile(organizationId, file, dirPath)),
    );

    if (filePaths.find((filePath) => filePath === null)) {
      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }

    try {
      let categoryId: string | undefined;
      if (assignedTo) {
        categoryId = await categoryRepository.createCategory(assignedTo);
      }

      const documentIds = await Promise.all(
        filePaths.map((filePath) => repository.createDocument(filePath!, assignedTo, categoryId)),
      );

      return documentIds;
    } catch (err) {
      logger.info(err);

      await Promise.all(filePaths.map((filePath) => filePath && service.deleteFileByFilePath(filePath)));

      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }
  };
}
