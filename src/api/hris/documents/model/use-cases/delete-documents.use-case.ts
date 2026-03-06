import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { type DocumentsRepository } from '../repositories';
import { type FilePersistenceServiceType } from '../service/file-persistence.service.type';

export function deleteDocumentsUseCase(repository: DocumentsRepository, service: FilePersistenceServiceType) {
  return async (organizationId: string, ids: CUID[], dirPath: string) => {
    const isDeleted = await service.deleteDirectory(organizationId, dirPath, true);

    if (!isDeleted) {
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }

    await repository.deleteDocuments(ids);
  };
}
