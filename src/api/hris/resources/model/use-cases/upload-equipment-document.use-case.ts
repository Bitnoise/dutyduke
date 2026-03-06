import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentDocumentsRepository } from '../repository/equipment-documents.repository';
import { EQUIPMENT_ERRORS } from '../../errors';
import { type DocumentsAcl } from '../acl';

export function uploadEquipmentDocumentUseCase(
  repository: EquipmentDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (equipmentId: CUID, file: File) => {
    const documentId = await documentsAcl.uploadEquipmentDocument(equipmentId, file);

    if (!documentId) {
      throw new ApiError(400, EQUIPMENT_ERRORS.DOCUMENTS.UPLOAD_FAILED);
    }

    try {
      await repository.createEquipmentDocument(equipmentId, documentId);
    } catch (err) {
      logger.info(err);
      await documentsAcl.deleteEquipmentFileById(documentId);

      throw new ApiError(400, EQUIPMENT_ERRORS.DOCUMENTS.UPLOAD_FAILED);
    }
  };
}
