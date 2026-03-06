import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsRepository } from '../repositories';
import { type UpdateDocumentDto } from '../dtos';

export function updateDocumentUseCase(repository: DocumentsRepository) {
  return async (id: CUID, data: UpdateDocumentDto) => {
    try {
      await repository.updateDocument(id, data);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.UPDATE_DOCUMENT_FAILED(id));
    }
  };
}
