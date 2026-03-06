import { instantiateHrisApi, type OrganizationContext } from '@/api/hris';
import { type DocumentsAcl } from '@/api/hris/resources/model/acl';
import { type OrderBy, type CUID } from '@/shared';
import { type UpdateEquipmentDocumentDto } from '../model/dtos';

export { type EmployeeCVPayload } from '@/templates/pdf/cv';

export function documentsAcl(organizationContext: OrganizationContext): DocumentsAcl {
  const uploadEquipmentDocument = async (equipmentId: CUID, document: File) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.uploadDocument(document, `equipments/${equipmentId}/documents`, 'Equipment');
  };

  /**
   * Upload equipment photo function
   * @returns ID of uploaded photo
   */
  const uploadEquipmentPhoto = async (equipmentId: CUID, photo: File) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.uploadDocument(photo, 'Equipment', `equipments/${equipmentId}/photos`);
  };

  const deleteEquipmentFileById = async (id: string) => {
    const api = instantiateHrisApi(organizationContext);
    return api.documents.deleteDocumentById(id);
  };

  const deleteEquipmentDocuments = async (documentIds: CUID[]) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.deleteMultipleDocuments(documentIds);
  };

  const getDocumentById = async (id: CUID) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.getDocumentById(id);
  };

  const getDocuments = async (
    ids: string[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
    perPage?: number,
  ) => {
    const api = instantiateHrisApi(organizationContext);

    return api.documents.getDocuments(ids, page, orderBy, perPage);
  };

  const updateEquipmentDocument = async (id: CUID, document: UpdateEquipmentDocumentDto) => {
    const api = instantiateHrisApi(organizationContext);

    return await api.documents.updateDocument(id, document);
  };

  return {
    uploadEquipmentDocument,
    uploadEquipmentPhoto,
    deleteEquipmentFileById,
    deleteEquipmentDocuments,
    getDocumentById,
    getDocuments,
    updateEquipmentDocument,
  };
}
