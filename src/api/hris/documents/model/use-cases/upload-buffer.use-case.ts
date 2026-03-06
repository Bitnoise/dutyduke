import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';
import { type DocumentsRepository } from '../repositories';

export function uploadBufferUseCase(repository: DocumentsRepository, service: FilePersistenceServiceType) {
  return async (organizationId: string, fileName: string, buffer: Buffer, dirPath: string): Promise<CUID> => {
    const filePath = await service.uploadBuffer(organizationId, fileName, buffer, dirPath);

    if (!filePath) {
      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }

    try {
      const documentId = await repository.createDocument(filePath, undefined, undefined);

      return documentId;
    } catch (err) {
      logger.info(err);
      await service.deleteFileByFilePath(filePath);

      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }
  };
}
