import { documentsAcl } from '@/api/hris/employees/infrastructure/acl/documents.acl';
import { type OrganizationContext } from '@/api/hris';
import { ApiError, type OrderBy, type CUID, API_ERROR_MESSAGES } from '@/shared';
import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import {
  deleteAllEmployeeDocumentsUseCase,
  deleteEmployeeDocumentsUseCase,
  deleteEmployeeDocumentUseCase,
  updateEmployeeDocumentUseCase,
  uploadEmployeeDocumentUseCase,
  validateEmployeeStatusUseCase,
} from '@/api/hris/employees/model/use-cases';
import { employeesDocumentsRepository } from '@/api/hris/employees/infrastructure/database/repositories';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction, PermissionScope } from '@/api/hris/authorization/permissions';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';
import {
  type EmployeeAction,
  type EmployeeDocumentDto,
  type EmployeeDocumentsWithAccessDto,
  type UpdateEmployeeDocumentDto,
} from '@/api/hris/employees/model/dtos';

export type EmployeesDocumentsController = {
  uploadEmployeeDocument: (employeeId: CUID, file: File) => Promise<void>;
  getEmployeeDocuments: (
    documentIds: CUID[],
    page: number,
    sort?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
  ) => Promise<EmployeeDocumentsWithAccessDto>;
  getEmployeeDocumentById: (id: CUID) => Promise<EmployeeDocumentDto>;
  updateEmployeeDocument: (employeeId: CUID, id: CUID, document: UpdateEmployeeDocumentDto) => Promise<void>;
  deleteEmployeeDocument: (employeeId: CUID, id: CUID) => Promise<void>;
  deleteAllEmployeeDocuments: (employeeId: CUID, documentIds: CUID[]) => Promise<void>;
  deleteEmployeeDocuments: (employeeId: CUID, documentsIds: CUID[]) => Promise<void>;
};

export function employeesDocumentsController(
  organizationContext: OrganizationContext,
): EmployeesDocumentsController {
  const documentsAclImpl = documentsAcl(organizationContext);
  const employeesDocumentsRepositoryImpl = employeesDocumentsRepository(organizationContext);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  const uploadEmployeeDocument = async (checker: PermissionChecker, employeeId: CUID, file: File) => {
    // Check if user can create documents
    const canCreate = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.CREATE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create documents');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only create documents for own employee record');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);
    await uploadEmployeeDocumentUseCase(employeesDocumentsRepositoryImpl, documentsAclImpl)(employeeId, file);
  };

  const getEmployeeDocumentById = async (checker: PermissionChecker, id: CUID) => {
    // Check if user can view documents
    const canView = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    const document = await documentsAclImpl.getDocumentById(id);

    if (!document) {
      throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND(id));
    }

    // If scope is SELF, verify this document belongs to the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || !currentEmployee.documentIds.includes(id)) {
        throw new ApiError(403, 'Forbidden: Can only view own documents');
      }
    }

    return document;
  };

  const updateEmployeeDocument = async (
    checker: PermissionChecker,
    employeeId: CUID,
    id: CUID,
    document: UpdateEmployeeDocumentDto,
  ) => {
    // Check if user can edit documents
    const canEdit = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.EDIT);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit documents');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only edit documents for own employee record');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);
    await updateEmployeeDocumentUseCase(documentsAclImpl)(id, document);
  };

  const deleteEmployeeDocument = async (checker: PermissionChecker, employeeId: CUID, documentId: CUID) => {
    // Check if user can delete documents
    const canDelete = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.DELETE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete documents');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only delete documents for own employee record');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);
    const employee = await employeeQueriesImpl.getEmployeeById(employeeId);

    if (!employee) {
      throw new ApiError(404, API_ERROR_MESSAGES.EMPLOYEES.NOT_FOUND(employeeId));
    }

    await deleteEmployeeDocumentUseCase(employeesDocumentsRepositoryImpl, documentsAclImpl)(
      employeeId,
      documentId,
      employee.documentIds,
    );
  };

  const deleteAllEmployeeDocuments = async (
    checker: PermissionChecker,
    employeeId: CUID,
    documentIds: CUID[],
  ) => {
    // Check if user can delete documents
    const canDelete = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.DELETE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete documents');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only delete documents for own employee record');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await deleteAllEmployeeDocumentsUseCase(employeesDocumentsRepositoryImpl, documentsAclImpl)(
      employeeId,
      documentIds,
    );
  };

  const getEmployeeDocuments = async (
    checker: PermissionChecker,
    documentIds: CUID[],
    page: number,
    sort?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
  ): Promise<EmployeeDocumentsWithAccessDto> => {
    // Check if user can view documents
    const canView = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view documents');
    }

    // If scope is SELF, filter to only show documents belonging to the current user's employee record
    let filteredDocumentIds = documentIds;
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee) {
        // User has no employee record, return empty list
        return {
          items: [],
          totalItems: 0,
          totalPages: 0,
          nextPage: null,
          prevPage: null,
          _access: {
            actions: [],
          },
        };
      }
      filteredDocumentIds = documentIds.filter((id) => currentEmployee.documentIds.includes(id));
    }

    const documents = await documentsAclImpl.getDocuments(filteredDocumentIds, page, sort);

    // Determine available actions based on permissions
    const canEdit = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.DELETE);
    const canCreate = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.CREATE);

    const actions: EmployeeAction[] = ['open' as EmployeeAction];
    if (canEdit) actions.push('edit' as EmployeeAction);
    if (canDelete) actions.push('delete' as EmployeeAction);
    if (canCreate) actions.push('create');

    return {
      ...documents,
      _access: {
        actions,
      },
    };
  };

  const deleteEmployeeDocuments = async (
    checker: PermissionChecker,
    employeeId: CUID,
    documentsIds: CUID[],
  ) => {
    // Check if user can delete documents
    const canDelete = checker.can(ResourceType.EMPLOYEE_DOCUMENTS, PermissionAction.DELETE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_DOCUMENTS);

    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete documents');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only delete documents for own employee record');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);
    const employee = await employeeQueriesImpl.getEmployeeById(employeeId);

    if (!employee) {
      throw new ApiError(404, API_ERROR_MESSAGES.EMPLOYEES.NOT_FOUND(employeeId));
    }

    await deleteEmployeeDocumentsUseCase(employeesDocumentsRepositoryImpl, documentsAclImpl)(
      employeeId,
      documentsIds,
      employee.documentIds,
    );
  };

  return {
    uploadEmployeeDocument: requirePermission(
      ResourceType.EMPLOYEE_DOCUMENTS,
      PermissionAction.CREATE,
      uploadEmployeeDocument,
    ),
    getEmployeeDocuments: privateRoute(getEmployeeDocuments),
    getEmployeeDocumentById: privateRoute(getEmployeeDocumentById),
    updateEmployeeDocument: requirePermission(
      ResourceType.EMPLOYEE_DOCUMENTS,
      PermissionAction.EDIT,
      updateEmployeeDocument,
    ),
    deleteEmployeeDocument: requirePermission(
      ResourceType.EMPLOYEE_DOCUMENTS,
      PermissionAction.DELETE,
      deleteEmployeeDocument,
    ),
    deleteAllEmployeeDocuments: requirePermission(
      ResourceType.EMPLOYEE_DOCUMENTS,
      PermissionAction.DELETE,
      deleteAllEmployeeDocuments,
    ),
    deleteEmployeeDocuments: requirePermission(
      ResourceType.EMPLOYEE_DOCUMENTS,
      PermissionAction.DELETE,
      deleteEmployeeDocuments,
    ),
  };
}
