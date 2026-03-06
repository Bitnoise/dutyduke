import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsAcl } from '../acl';
import { type EmployeesDocumentsRepository } from '../repositories';

export function deleteEmployeeDocumentsUseCase(
  repository: EmployeesDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (employeeId: CUID, documentIds: CUID[], currentDocumentIds: CUID[]) => {
    try {
      const docsToLeave = currentDocumentIds.filter((id) => !documentIds.includes(id));

      await repository.deleteEmployeeDocuments(employeeId, docsToLeave);
      await documentsAcl.deleteEmployeeDocuments(documentIds);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
