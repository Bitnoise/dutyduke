import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';
import { type DocumentsCategoryRepository, type DocumentsRepository } from '../repositories';

export function uploadDocumentUseCase(
  repository: DocumentsRepository,
  categoryRepository: DocumentsCategoryRepository,
  service: FilePersistenceServiceType,
) {
  return async (organizationId: CUID, file: File, dirPath: string, assignedTo?: string): Promise<CUID> => {
    const filePath = await service.uploadFile(organizationId, file, dirPath);

    if (!filePath) {
      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }

    try {
      let categoryId;
      if (assignedTo) {
        categoryId = await categoryRepository.createCategory(assignedTo);
      }

      const documentId = await repository.createDocument(filePath, assignedTo, categoryId);

      return documentId;
    } catch (err) {
      logger.info(err);
      await service.deleteFileByFilePath(filePath);

      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }
  };
}
