import { type DocumentsAcl } from '@/api/hris/employees/model/acl';
import { type EmployeesDocumentsRepository } from '@/api/hris/employees/model/repositories';
import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteAllEmployeeDocumentsUseCase(
  repository: EmployeesDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (employeeId: CUID, documentIds: CUID[]) => {
    try {
      await repository.deleteAllEmployeeDocuments(employeeId);
      await documentsAcl.deleteEmployeeDocuments(documentIds);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
