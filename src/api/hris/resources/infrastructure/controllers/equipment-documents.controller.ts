import { type OrganizationContext } from '@/api/hris';
import { type OrderBy, type CUID, ApiError, API_ERROR_MESSAGES, ITEMS_PER_PAGE } from '@/shared';
import { privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { equipmentQueries } from '../database/queries';
import { documentsAcl } from '../../acl';
import { type EquipmentDocumentDto } from '../../model/dtos';
import { EQUIPMENT_ERRORS } from '../../errors';
import {
  type EquipmentDocumentsWithAccessDto,
  type UpdateEquipmentDocumentDto,
} from '../../model/dtos/equipment-document.dtos';
import {
  deleteEquipmentDocumentsUseCase,
  deleteEquipmentDocumentUseCase,
  updateEquipmentDocumentUseCase,
  uploadEquipmentDocumentUseCase,
  validateEquipmentStatusUseCase,
} from '../../model/use-cases';
import { equipmentDocumentsRepository } from '../database/repositories';

export type EquipmentDocumentsController = {
  uploadEquipmentDocument: (equipmentId: CUID, file: File) => Promise<void>;
  getEquipmentDocumentById: (documentId: CUID) => Promise<EquipmentDocumentDto>;
  getEquipmentDocuments: (
    documentIds: CUID[],
    page: number,
    sort?: Extract<OrderBy, 'expDate-asc' | 'expDate-desc'>,
    perPage?: number,
  ) => Promise<EquipmentDocumentsWithAccessDto>;
  deleteEquipmentDocument: (equipmentId: CUID, id: CUID) => Promise<void>;
  deleteEquipmentDocuments: (equipmentId: CUID, documentIds: CUID[]) => Promise<void>;
  updateEquipmentDocument: (
    equipmentId: CUID,
    id: CUID,
    document: UpdateEquipmentDocumentDto,
  ) => Promise<void>;
};

export function equipmentDocumentsController(
  organizationContext: OrganizationContext,
): EquipmentDocumentsController {
  const equipmentDocumentsRepositoryImpl = equipmentDocumentsRepository(organizationContext);
  const equipmentQueriesImpl = equipmentQueries(organizationContext);
  const documentsAclImpl = documentsAcl(organizationContext);

  const uploadEquipmentDocument = async (equipmentId: CUID, file: File) => {
    const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
    validateEquipmentStatusUseCase(equipment, equipmentId);
    await uploadEquipmentDocumentUseCase(equipmentDocumentsRepositoryImpl, documentsAclImpl)(
      equipmentId,
      file,
    );
  };

  const getEquipmentDocumentById = async (id: CUID) => {
    const document = await documentsAclImpl.getDocumentById(id);

    if (!document) {
      throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(id));
    }

    return document;
  };

  const getEquipmentDocuments = async (
    checker: PermissionChecker,
    documentIds: CUID[],
    page: number,
    sort?: Extract<OrderBy, 'expDate-asc' | 'expDate-desc'>,
    perPage = ITEMS_PER_PAGE,
  ): Promise<EquipmentDocumentsWithAccessDto> => {
    const isOwner = checker.isOwner();
    const documents = await documentsAclImpl.getDocuments(documentIds, page, sort, perPage);
    return {
      ...documents,
      _access: { actions: isOwner ? ['delete', 'edit', 'open', 'select'] : [] },
    };
  };

  const deleteEquipmentDocument = async (equipmentId: CUID, id: CUID) => {
    const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
    validateEquipmentStatusUseCase(equipment, equipmentId);

    if (!equipment) {
      throw new ApiError(404, API_ERROR_MESSAGES.EQUIPMENT.NOT_FOUND(equipmentId));
    }

    await deleteEquipmentDocumentUseCase(equipmentDocumentsRepositoryImpl, documentsAclImpl)(
      equipmentId,
      id,
      equipment.documentIds,
    );
  };

  const deleteEquipmentDocuments = async (equipmentId: CUID, documentIds: CUID[]) => {
    const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
    validateEquipmentStatusUseCase(equipment, equipmentId);

    if (!equipment) {
      throw new ApiError(404, API_ERROR_MESSAGES.EQUIPMENT.NOT_FOUND(equipmentId));
    }

    await deleteEquipmentDocumentsUseCase(equipmentDocumentsRepositoryImpl, documentsAclImpl)(
      equipmentId,
      documentIds,
      equipment.documentIds,
    );
  };

  const updateEquipmentDocument = async (
    equipmentId: CUID,
    id: CUID,
    document: UpdateEquipmentDocumentDto,
  ) => {
    const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
    validateEquipmentStatusUseCase(equipment, equipmentId);

    await updateEquipmentDocumentUseCase(documentsAclImpl)(id, document);
  };

  return {
    uploadEquipmentDocument,
    getEquipmentDocuments: privateRoute(getEquipmentDocuments),
    getEquipmentDocumentById,
    deleteEquipmentDocument,
    deleteEquipmentDocuments,
    updateEquipmentDocument,
  };
}
