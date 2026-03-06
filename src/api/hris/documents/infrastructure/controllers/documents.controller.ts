import { type OrganizationContext } from '@/api/hris';
import {
  type OrderBy,
  type CUID,
  type Paginated,
  ApiError,
  API_ERROR_MESSAGES,
  type Nullable,
  type DocumentsOrderBy,
  type DocumentListActions,
  DOCUMENT_ACCESSIBLE_COLS,
  type DocumentListType,
  ITEMS_PER_PAGE,
} from '@/shared';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';
import { checkResourcePermission } from '@/api/hris/authorization/permissionChecker';
import { type DocumentStatus } from '@/api/hris/prisma/client';
import { filePersistenceFactory } from '@/shared/service/file-persistance';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';
import { documentCategoryRepository, documentsRepository } from '../database/repositories';
import {
  type UpdateDocumentDto,
  type DocumentDto,
  type DocumentsStatus,
  type DocumentsAssignStatus,
  type DocumentsListWithAccessDto,
  type DocumentsListItemDto,
} from '../../model/dtos';
import { documentsQueries } from '../database/queries';
import {
  archiveDocumentsUseCase,
  deleteDocumentUseCase,
  getDocumentsListUseCase,
  updateDocumentsUseCase,
  updateDocumentUseCase,
  uploadDocumentsUseCase,
  uploadDocumentUseCase,
} from '../../model/use-cases';
import { deleteMultipleDocumentsUseCase } from '../../model/use-cases/delete-multiple-documents.use-case';
import { DOCUMENTS_ERRORS } from '../../errors';
import { uploadBufferUseCase } from '../../model/use-cases/upload-buffer.use-case';

export type DocumentsController = {
  uploadDocument: (file: File, dirPath: string, assignedTo?: string) => Promise<CUID>;
  uploadBuffer: (fileName: string, buffer: Buffer, dirPath: string) => Promise<CUID>;
  uploadDocuments: (file: File[], dirPath: string, assignedTo?: string) => Promise<CUID[]>;
  getDocuments: (
    ids: CUID[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
    perPage?: number,
  ) => Promise<Paginated<DocumentDto>>;
  getDocumentById: (id: CUID) => Promise<Nullable<DocumentDto>>;
  getDocumentByFilePath: (filePath: string) => Promise<Nullable<DocumentDto>>;
  updateDocument: (id: CUID, data: UpdateDocumentDto) => Promise<void>;
  updateDocuments: (
    ids: 'all' | CUID[],
    data: UpdateDocumentDto,
    category: string,
    assignment: string,
    status: string,
  ) => Promise<void>;
  getAllDocuments: (category: string, assignment: string, status: string) => Promise<DocumentDto[]>;
  deleteDocumentById: (id: CUID) => Promise<void>;
  deleteMultipleDocuments: (ids: CUID[]) => Promise<void>;
  getDocumentsList(
    listType: DocumentListType,
    page: number,
    orderBy: DocumentsOrderBy,
    statusFilter: DocumentsStatus[],
    assignFilter: DocumentsAssignStatus[],
    categoryId: Nullable<CUID>,
    expDate?: boolean,
    query?: string,
    perPage?: number,
  ): Promise<DocumentsListWithAccessDto>;
  archiveDocuments: (
    ids: 'all' | CUID[],
    category: string,
    assignment: string,
    status: string,
  ) => Promise<void>;
};

export function documentsController(organizationContext: OrganizationContext): DocumentsController {
  const { organizationId, db } = organizationContext;

  // Implementations
  const documentsRepositoryImpl = documentsRepository(db);
  const filePersistenceServiceImpl = filePersistenceFactory('persistent-volume');
  const documentsQueriesImpl = documentsQueries(organizationContext);
  const documentCategoryRepositoryImpl = documentCategoryRepository(db);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  // Endpoints
  const uploadDocument = async (
    checker: PermissionChecker,
    file: File,
    dirPath: string,
    assignedTo?: string,
  ) => {
    // Check if user can create documents
    const canCreate = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.CREATE);
    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create documents');
    }

    const id = await uploadDocumentUseCase(
      documentsRepositoryImpl,
      documentCategoryRepositoryImpl,
      filePersistenceServiceImpl,
    )(organizationId, file, dirPath, assignedTo);
    return id;
  };

  const uploadDocuments = async (
    checker: PermissionChecker,
    file: File[],
    dirPath: string,
    assignedTo?: string,
  ) => {
    // Check if user can create documents
    const canCreate = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.CREATE);
    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create documents');
    }

    const ids = await uploadDocumentsUseCase(
      documentsRepositoryImpl,
      documentCategoryRepositoryImpl,
      filePersistenceServiceImpl,
    )(organizationId, file, dirPath, assignedTo);
    return ids;
  };

  const uploadBuffer = async (
    checker: PermissionChecker,
    fileName: string,
    buffer: Buffer,
    dirPath: string,
  ) => {
    // Check if user can create documents
    const canCreate = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.CREATE);
    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create documents');
    }

    const id = await uploadBufferUseCase(documentsRepositoryImpl, filePersistenceServiceImpl)(
      organizationId,
      fileName,
      buffer,
      dirPath,
    );

    return id;
  };

  const getDocuments = async (
    checker: PermissionChecker,
    ids: CUID[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
    perPage = ITEMS_PER_PAGE,
  ): Promise<Paginated<DocumentDto>> => {
    // Check if user can view documents (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    // If employee permission with SELF scope, filter to only show documents belonging to the user's employee record
    let filteredIds = ids;
    if (permissionCheck.requiresOwnershipVerification) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee) {
        // User has no employee record, return empty list
        return {
          items: [],
          totalItems: 0,
          totalPages: 0,
          nextPage: null,
          prevPage: null,
        };
      }
      filteredIds = ids.filter((id) => currentEmployee.documentIds.includes(id));
    }

    const documents = await documentsQueriesImpl.getDocuments(filteredIds, page, orderBy, perPage);

    return documents;
  };

  const getDocumentById = async (checker: PermissionChecker, id: CUID) => {
    // Check if user can view documents (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    // If employee permission with SELF scope, verify ownership
    if (permissionCheck.requiresOwnershipVerification) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || !currentEmployee.documentIds.includes(id)) {
        throw new ApiError(403, 'Forbidden: Can only view own documents');
      }
    }

    const document = await documentsQueriesImpl.getDocumentById(id);

    if (!document) {
      throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND(id));
    }
    return document;
  };

  const getDocumentByFilePath = async (checker: PermissionChecker, filePath: CUID) => {
    // Check if user can view documents (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    const document = await documentsQueriesImpl.getDocumentByFilePath(filePath);

    if (!document) {
      throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND_BY_FILEPATH);
    }

    // If employee permission with SELF scope, verify ownership
    if (permissionCheck.requiresOwnershipVerification) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || !currentEmployee.documentIds.includes(document.id)) {
        throw new ApiError(403, 'Forbidden: Can only view own documents');
      }
    }

    return document;
  };

  const updateDocument = async (checker: PermissionChecker, id: CUID, data: UpdateDocumentDto) => {
    // Check if user can edit documents
    const canEdit = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT);
    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit documents');
    }

    await updateDocumentUseCase(documentsRepositoryImpl)(id, data);
  };

  const deleteDocumentById = async (checker: PermissionChecker, id: CUID) => {
    // Check if user can delete documents
    const canDelete = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.DELETE);
    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete documents');
    }

    const file = await getDocumentById(checker, id);

    if (!file) {
      throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND(id));
    }

    await deleteDocumentUseCase(documentsRepositoryImpl, filePersistenceServiceImpl)(id, file?.filePath);
  };

  const deleteMultipleDocuments = async (checker: PermissionChecker, ids: CUID[]) => {
    // Check if user can delete documents
    const canDelete = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.DELETE);
    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete documents');
    }

    const documents = await Promise.all(ids.map((id) => getDocumentById(checker, id)));

    if (!documents) {
      throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND_MULTIPLE);
    }

    const documentsFilePaths = documents.filter((doc) => doc !== null).map((doc) => doc?.filePath);

    await deleteMultipleDocumentsUseCase(documentsRepositoryImpl, filePersistenceServiceImpl)(
      ids,
      documentsFilePaths,
    );
  };

  const getDocumentsList = async (
    checker: PermissionChecker,
    listType: DocumentListType,
    page = 1,
    orderBy = 'createdAt-desc' as DocumentsOrderBy,
    statusFilter: DocumentsStatus[],
    assignFilter: DocumentsAssignStatus[] = ['ASSIGNED', 'FREE'],
    categoryId: Nullable<CUID>,
    expDate?: boolean,
    query?: string,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<DocumentsListWithAccessDto> => {
    // Check if user can view documents
    const canView = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    const canCreate = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.CREATE);
    const canEdit = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.DELETE);
    const isOwner = checker.isOwner();

    // Filter based on permissions - users with VIEW permission can see all statuses and assign filters
    const filteredStatusFilter: DocumentsStatus[] = canView ? statusFilter : ['ACTIVE', 'EXPIRING_SOON'];
    const filteredAssignFilter: DocumentsAssignStatus[] = canView ? assignFilter : ['ASSIGNED'];

    const data = await getDocumentsListUseCase(documentsQueriesImpl)(
      page,
      perPage,
      orderBy,
      filteredStatusFilter,
      filteredAssignFilter,
      categoryId,
      query,
      expDate,
    );

    let accessibleColumns: (keyof DocumentsListItemDto)[] = [];
    let accessibleActions: DocumentListActions[] = [];

    if (isOwner || (canView && canEdit && canDelete)) {
      accessibleColumns = DOCUMENT_ACCESSIBLE_COLS[listType].OWNER;
      accessibleActions = ['select', 'open'];
      if (canEdit) accessibleActions.push('edit');
      if (canDelete) accessibleActions.push('delete');
      if (canView) accessibleActions.push('filter');
      if (canCreate) accessibleActions.push('addFile');
    } else {
      accessibleColumns = DOCUMENT_ACCESSIBLE_COLS[listType].EMPLOYEE;
      accessibleActions = ['select', 'open'];
    }

    return {
      ...data,
      _access: {
        columns: accessibleColumns,
        actions: accessibleActions,
      },
    };
  };

  const getAllDocuments = async (
    checker: PermissionChecker,
    category?: string,
    status?: string,
    filter?: string,
  ) => {
    // Check if user can view documents
    const canView = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    const parsedCategoryFilter = category === 'ALL' ? undefined : category;
    const parsedStatusFilter = (
      status ? status.split(',') : ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'ARCHIVED']
    ) as DocumentStatus[];
    const parsedFilterParam = (filter ? filter.split(',') : ['ASSIGNED', 'FREE']) as DocumentsAssignStatus[];

    const documents = await documentsQueriesImpl.getAllDocuments(
      parsedStatusFilter,
      parsedFilterParam,
      parsedCategoryFilter,
    );

    if (!documents) {
      throw new ApiError(404, DOCUMENTS_ERRORS.NOT_FOUND);
    }

    return documents;
  };

  const updateDocuments = async (
    checker: PermissionChecker,
    documentIds: 'all' | CUID[],
    data: UpdateDocumentDto,
    category: string,
    assignment: string,
    status: string,
  ) => {
    // Check if user can edit documents
    const canEdit = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT);
    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit documents');
    }

    let ids: CUID[] = [];

    const parsedStatus = status
      .split(',')
      .filter((s) => s !== 'ARCHIVED')
      .join(',');

    if (!parsedStatus.length) return;

    if (documentIds === 'all') {
      const allDocuments = await getAllDocuments(checker, category, parsedStatus, assignment);

      ids = allDocuments.filter((doc) => !doc.status.includes('ARCHIVED')).map((doc) => doc.id);
    } else {
      const chosenDocs = await Promise.all(documentIds.map((docId) => getDocumentById(checker, docId)));

      ids = chosenDocs.filter((doc) => doc && !doc.status.includes('ARCHIVED')).map((doc) => doc!.id);
    }

    await updateDocumentsUseCase(documentsRepositoryImpl, documentCategoryRepositoryImpl)(ids, data);
  };

  const archiveDocuments = async (
    checker: PermissionChecker,
    documentIds: 'all' | CUID[],
    categoryFilter: string,
    assignmentFilter: string,
    statusFilter: string,
  ) => {
    // Check if user can delete documents (archiving is a form of deletion)
    const canDelete = checker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.DELETE);
    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to archive documents');
    }

    let ids: CUID[] = [];

    const parsedStatus = statusFilter
      .split(',')
      .filter((s) => s !== 'ARCHIVED')
      .join(',');

    if (!parsedStatus.length) return;

    if (documentIds === 'all') {
      const allDocuments = await getAllDocuments(checker, categoryFilter, parsedStatus, assignmentFilter);

      ids = allDocuments.filter((doc) => !doc.status.includes('ARCHIVED')).map((doc) => doc.id);
    } else {
      const chosenDocs = await Promise.all(documentIds.map((docId) => getDocumentById(checker, docId)));

      ids = chosenDocs.filter((doc) => doc && !doc.status.includes('ARCHIVED')).map((doc) => doc!.id);
    }

    await archiveDocumentsUseCase(documentsRepositoryImpl)(ids);
  };

  return {
    uploadBuffer: requirePermission(ResourceType.COMPANY_DOCUMENTS, PermissionAction.CREATE, uploadBuffer),
    uploadDocument: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.CREATE,
      uploadDocument,
    ),
    uploadDocuments: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.CREATE,
      uploadDocuments,
    ),
    getDocuments: privateRoute(getDocuments),
    getDocumentById: privateRoute(getDocumentById),
    updateDocument: requirePermission(ResourceType.COMPANY_DOCUMENTS, PermissionAction.EDIT, updateDocument),
    deleteDocumentById: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.DELETE,
      deleteDocumentById,
    ),
    getDocumentsList: privateRoute(getDocumentsList),
    deleteMultipleDocuments: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.DELETE,
      deleteMultipleDocuments,
    ),
    getDocumentByFilePath: privateRoute(getDocumentByFilePath),
    getAllDocuments: privateRoute(getAllDocuments),
    updateDocuments: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.EDIT,
      updateDocuments,
    ),
    archiveDocuments: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.DELETE,
      archiveDocuments,
    ),
  };
}
