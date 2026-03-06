import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsRepository } from '../repositories';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';

export function deleteDocumentUseCase(repository: DocumentsRepository, service: FilePersistenceServiceType) {
  return async (id: CUID, filePath: string) => {
    const isDeleted = await service.deleteFileByFilePath(filePath);

    if (!isDeleted) {
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_DOCUMENT_FAILED(id));
    }

    try {
      await repository.deleteDocumentById(id);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_DOCUMENT_FAILED(id));
    }
  };
}
