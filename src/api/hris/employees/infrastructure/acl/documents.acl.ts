import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type DocumentsAcl } from '@/api/hris/employees/model/acl';
import { type CUID, type OrderBy } from '@/shared';
import { type EmployeeCVPayload } from '@/templates/pdf/cv';
import { type UpdateEmployeeDocumentDto } from '../../model/dtos';

export { type EmployeeCVPayload } from '@/templates/pdf/cv';

export function documentsAcl(organizationContext: OrganizationContext): DocumentsAcl {
  const getEmployeeCvPdfBuffer = async (cvTemplateVariables: EmployeeCVPayload) => {
    const api = instantiateHrisApi(organizationContext);
    return api.documents.getPdfBuffer('cv', cvTemplateVariables);
  };

  const uploadEmployeeDocument = async (file: File, dirPath?: string) => {
    const api = instantiateHrisApi(organizationContext);

    const id = await api.documents.uploadDocument(file, dirPath ?? '', 'Employee');
    return id;
  };

  const getDocumentById = async (id: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.getDocumentById(id);
  };

  const getDocumentByFilePath = async (filePath: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.getDocumentByFilePath(filePath);
  };

  const getDocuments = async (
    ids: string[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
  ) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.getDocuments(ids, page, orderBy);
  };

  const deleteEmployeeDocumentByFilePath = async (filePath: string) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.deleteFileByFilePath('persistent-volume', filePath);
  };

  const deleteEmployeeDocuments = async (documentIds: CUID[]) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.deleteMultipleDocuments(documentIds);
  };

  const deleteDocumentById = async (documentId: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    return await api.documents.deleteDocumentById(documentId);
  };

  const deleteEmployeeDirectory = async (dirPath: string, force?: boolean) => {
    const api = instantiateHrisApi(organizationContext);

    return await api.documents.deleteDirectory('persistent-volume', dirPath, force);
  };

  const updateEmployeeDocument = async (id: CUID, document: UpdateEmployeeDocumentDto) => {
    const api = instantiateHrisApi(organizationContext);

    return await api.documents.updateDocument(id, document);
  };

  return {
    getEmployeeCvPdfBuffer,
    uploadEmployeeDocument,
    deleteEmployeeDocumentByFilePath,
    deleteEmployeeDocuments,
    getDocumentById,
    getDocuments,
    deleteDocumentById,
    deleteEmployeeDirectory,
    updateEmployeeDocument,
    getDocumentByFilePath,
  };
}
