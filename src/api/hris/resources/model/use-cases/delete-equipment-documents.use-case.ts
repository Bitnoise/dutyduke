import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentDocumentsRepository } from '../repository/equipment-documents.repository';
import { type DocumentsAcl } from '../acl';

export function deleteEquipmentDocumentsUseCase(
  repository: EquipmentDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (equipmentId: CUID, documentIds: CUID[], currentDocumentIds: CUID[]) => {
    try {
      const docIdsToUpdate = currentDocumentIds.filter((id) => !documentIds.includes(id));

      await repository.deleteEquipmentDocuments(equipmentId, docIdsToUpdate);

      await documentsAcl.deleteEquipmentDocuments(documentIds);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
