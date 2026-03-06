import { type UpdateEmployeeDocumentDto } from '@/api/hris/employees/model/dtos';
import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsAcl } from '../acl';

export function updateEquipmentDocumentUseCase(documentsAcl: DocumentsAcl) {
  return async (id: CUID, document: UpdateEmployeeDocumentDto) => {
    try {
      await documentsAcl.updateEquipmentDocument(id, document);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.UPDATE_DOCUMENT_FAILED(id));
    }
  };
}
