import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsAcl } from '../acl';
import { type EquipmentDocumentsRepository } from '../repository/equipment-documents.repository';

export function deleteEquipmentDocumentUseCase(
  repository: EquipmentDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (equipmentId: CUID, documentId: CUID, equipmentDocumentIds: CUID[]) => {
    try {
      const docIdsToUpdate = equipmentDocumentIds.filter((id) => id !== documentId);

      await repository.deleteEquipmentDocuments(equipmentId, docIdsToUpdate);
      await documentsAcl.deleteEquipmentFileById(documentId);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_DOCUMENT_FAILED(documentId));
    }
  };
}
