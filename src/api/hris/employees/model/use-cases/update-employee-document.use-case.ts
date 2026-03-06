import { type UpdateEmployeeDocumentDto } from '@/api/hris/employees/model/dtos';
import { type CUID } from '@/shared';
import { type DocumentsAcl } from '../acl';

export function updateEmployeeDocumentUseCase(documentsAcl: DocumentsAcl) {
  return async (id: CUID, document: UpdateEmployeeDocumentDto) => {
    await documentsAcl.updateEmployeeDocument(id, document);
  };
}
