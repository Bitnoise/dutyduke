import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type DocumentsAcl } from '@/api/hris/employees/model/acl';
import { type EmployeesDocumentsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteEmployeeDocumentUseCase(
  repository: EmployeesDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (employeeId: CUID, documentId: CUID, employeeDocumentIds: CUID[]) => {
    try {
      const updatedDocumentIds = employeeDocumentIds.filter((id) => id !== documentId);

      await repository.deleteEmployeeDocuments(employeeId, updatedDocumentIds);
      await documentsAcl.deleteDocumentById(documentId);
    } catch (err) {
      logger.info(err);

      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.DELETE_FAILED);
    }
  };
}
