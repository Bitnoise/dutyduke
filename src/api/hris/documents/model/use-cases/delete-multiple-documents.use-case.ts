import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsRepository } from '../repositories';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';

export function deleteMultipleDocumentsUseCase(
  repository: DocumentsRepository,
  service: FilePersistenceServiceType,
) {
  return async (ids: CUID[], filePaths: string[]) => {
    try {
      await repository.deleteDocuments(ids);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }

    try {
      await Promise.all(filePaths.map((filePath) => service.deleteFileByFilePath(filePath)));
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
