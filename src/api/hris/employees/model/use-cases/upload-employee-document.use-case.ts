import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type DocumentsAcl } from '@/api/hris/employees/model/acl';
import { type EmployeesDocumentsRepository } from '@/api/hris/employees/model/repositories';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function uploadEmployeeDocumentUseCase(
  repository: EmployeesDocumentsRepository,
  documentsAcl: DocumentsAcl,
) {
  return async (employeeId: CUID, file: File) => {
    const id = await documentsAcl.uploadEmployeeDocument(file, `documents/${employeeId}`);

    if (!id) {
      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }

    try {
      await repository.createEmployeeDocument(employeeId, id);
    } catch (err) {
      logger.info(err);
      await documentsAcl.deleteEmployeeDocumentByFilePath(id);

      throw new ApiError(400, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.UPLOAD_FAILED);
    }
  };
}
