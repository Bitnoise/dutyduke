import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsRepository } from '../repositories';

export function archiveDocumentsUseCase(repository: DocumentsRepository) {
  return async (documentIds: CUID[]) => {
    try {
      await Promise.all(
        documentIds.map((documentId) => repository.updateDocument(documentId, { status: ['ARCHIVED'] })),
      );
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
