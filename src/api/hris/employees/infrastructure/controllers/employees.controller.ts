import { cache } from 'react';
import { ApiError, type Nullable, type CUID, type EmployeeListOrderBy, ITEMS_PER_PAGE } from '@/shared';
import { type UpdateEmployeeGeneralInfoSchema } from '@/api/hris/employees/infrastructure/controllers/schemas';
import { employeeQueries, employeesSkillQueries } from '@/api/hris/employees/infrastructure/database/queries';
import {
  getEmployeeViewAccess,
  isOwnerRoute,
  privateRoute,
  requirePermission,
  type PermissionChecker,
} from '@/api/hris/authorization';
import { PermissionAction, PermissionScope, ResourceType } from '@/api/hris/authorization/permissions';
import {
  type EmployeeListDto,
  type CreateEmployeeDto,
  type EmployeeStatusDto,
  type BaseEmployeeDto,
  type BaseEmployeeWithAccessDto,
  type EmployeeAction,
  type EmployeeGeneralInfoWithAccessDto,
  type EmployeeGeneralInfoAccess,
  type AssignedEmployeeDto,
} from '@/api/hris/employees/model/dtos';
import { employeeRepository } from '@/api/hris/employees/infrastructure/database/repositories';
import { updateEmployeeUseCase } from '@/api/hris/employees/model/use-cases/update-employee.use-case';
import {
  archiveEmployeeUseCase,
  createEmployeeUseCase,
  updateEmployeeStatusUseCase,
  validateEmployeeStatusUseCase,
} from '@/api/hris/employees/model/use-cases';

import { type OrganizationContext } from '@/api/hris';
import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { getOrganizationNameAcl } from '@/api/hris/acl';

export type EmployeesController = {
  getEmployeeGeneralInfo: (employeeId: CUID) => Promise<EmployeeGeneralInfoWithAccessDto>;
  getAllEmployees: (query?: string, limit?: number) => Promise<BaseEmployeeDto[]>;
  getAllEmployeesList: (
    page: number,
    search: string,
    sort: EmployeeListOrderBy,
    perPage?: number,
    filters?: EmployeeStatusDto[],
  ) => Promise<EmployeeListDto>;
  updateEmployeeGeneralInfo: (employeeId: CUID, employee: UpdateEmployeeGeneralInfoSchema) => Promise<void>;
  createEmployee: (employee: CreateEmployeeDto) => Promise<CUID>;
  getEmployeeById: (employeeId: CUID) => Promise<BaseEmployeeWithAccessDto>;
  getEmployeeByEmail: (email: string) => Promise<BaseEmployeeDto>;
  getEmployeeOrganizationName: () => Promise<string>;
  updateEmployeeStatus: (employeeId: CUID, status: EmployeeStatusDto) => Promise<void>;
  isWorkEmailTaken: (email: string) => Promise<boolean>;
  archiveEmployee: (employeeId: string) => Promise<void>;
  validateEmployeeStatus: (employeeId: CUID) => Promise<void>;
  getEmployeeByDocumentId: (documentId: CUID) => Promise<Nullable<AssignedEmployeeDto>>;
  queryEmployees(query: string): Promise<CUID[]>;
  getEmployeesById(employeeIds: CUID[]): Promise<BaseEmployeeDto[]>;
  getEmployeeBySkillIds(skillIds: CUID[]): Promise<CUID[]>;
  deleteAllEmployees: () => Promise<void>;
  getEmployeesCount: () => Promise<number>;
};

export function employeesController(organizationContext: OrganizationContext): EmployeesController {
  const employeeQueriesInstance = employeeQueries(organizationContext);
  const employeeSkillQueriesImpl = employeesSkillQueries(organizationContext);
  const employeeRepositoryInstance = employeeRepository(organizationContext.db);

  // Request-scoped memo for the caller's own employee record. A profile page renders
  // metadata, layout, header, and content — each triggering an access check — so we
  // dedupe the identity→employee lookup with React's per-request `cache`.
  const loadCurrentEmployee = cache(async (identityId: CUID) =>
    employeeQueriesInstance.getEmployeeByIdentityId(identityId),
  );

  const resolveEmployeeViewAccess = async (checker: PermissionChecker, employeeId: CUID): Promise<void> => {
    const { canView, hasCompanyWideAccess } = getEmployeeViewAccess(checker);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view employees');
    }

    if (hasCompanyWideAccess) {
      return;
    }

    const currentEmployee = await loadCurrentEmployee(checker.getIdentityId());
    if (!currentEmployee || currentEmployee.id !== employeeId) {
      throw new ApiError(403, 'Forbidden: Can only view own employee data');
    }
  };

  const getEmployeeFieldAccess = async (checker: PermissionChecker): Promise<EmployeeGeneralInfoAccess> => {
    if (checker.isOwner()) {
      return true;
    }

    const fieldAccess = checker.getFieldAccess(ResourceType.EMPLOYEES);
    if (fieldAccess === true) {
      return true;
    }

    // Default field access for non-owners
    return {
      firstName: true,
      lastName: true,
      birthdate: true,
      phone: true,
      workEmail: true,
      icePhone: true,
      iceName: true,
      additionalEmails: true,
      hobbies: true,
      children: true,
      photosIds: true,
      ...(fieldAccess as Record<string, boolean>),
    };
  };

  const getEmployeeGeneralInfo = async (checker: PermissionChecker, employeeId: CUID) => {
    await resolveEmployeeViewAccess(checker, employeeId);

    const employee = await employeeQueriesInstance.getEmployeeGeneralInfo(employeeId);

    // Check if user has EDIT permission - if not, set edit access to false
    const canEdit = checker.can(ResourceType.EMPLOYEES, PermissionAction.EDIT);
    const editAccess = canEdit ? await getEmployeeFieldAccess(checker) : false;

    return {
      ...employee,
      _access: {
        edit: editAccess,
      },
    };
  };
  const updateEmployeeGeneralInfo = async (
    checker: PermissionChecker,
    employeeId: CUID,
    employee: UpdateEmployeeGeneralInfoSchema,
  ) => {
    // Check if user can edit employees
    const canEdit = checker.can(ResourceType.EMPLOYEES, PermissionAction.EDIT);
    const editScope = checker.getScope(ResourceType.EMPLOYEES);

    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit employees');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (editScope === PermissionScope.SELF) {
      const currentEmployee = await loadCurrentEmployee(checker.getIdentityId());

      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only edit own employee data');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesInstance)(employeeId);
    const fieldAccess = await getEmployeeFieldAccess(checker);

    await updateEmployeeUseCase(employeeRepositoryInstance)(employeeId, employee, fieldAccess);
  };
  const createEmployee = async (checker: PermissionChecker, employee: CreateEmployeeDto) => {
    // Check if user can create employees
    const canCreate = checker.can(ResourceType.EMPLOYEES, PermissionAction.CREATE);
    const createScope = checker.getScope(ResourceType.EMPLOYEES);

    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create employees');
    }

    // SELF scope users cannot create employees (they can only manage their own)
    if (createScope === PermissionScope.SELF) {
      throw new ApiError(403, 'Forbidden: Cannot create employees with SELF scope');
    }

    const existingEmployee = await employeeQueriesInstance.getEmployeeByEmail(employee.workEmail);

    if (existingEmployee) {
      throw new ApiError(409, EMPLOYEE_ERROR_MESSAGES.ALREADY_EXISTS);
    }

    return createEmployeeUseCase(employeeRepositoryInstance)(employee);
  };

  const getEmployeeById = async (
    checker: PermissionChecker,
    employeeId: CUID,
  ): Promise<BaseEmployeeWithAccessDto> => {
    await resolveEmployeeViewAccess(checker, employeeId);

    const employee = await employeeQueriesInstance.getEmployeeById(employeeId);

    if (!employee) {
      throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
    }

    // Determine available actions based on permissions
    const availableActions: EmployeeAction[] = [];
    const canView = checker.can(ResourceType.EMPLOYEES, PermissionAction.VIEW);
    const canEdit = checker.can(ResourceType.EMPLOYEES, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.EMPLOYEES, PermissionAction.DELETE);
    const canAssign = checker.can(ResourceType.EMPLOYEES, PermissionAction.ASSIGN);
    const viewScope = checker.getScope(ResourceType.EMPLOYEES);

    // Bulk/company-wide actions require ALL scope on EMPLOYEES
    if (canView && viewScope === PermissionScope.ALL) {
      if (canDelete) availableActions.push('archive');
      if (canAssign) availableActions.push('assign');
      availableActions.push('filter', 'generate-cv');
    }

    // Edit available for both ALL and SELF (with SELF limited to own data)
    if (canEdit) availableActions.push('select');

    // Mail is available to everyone
    availableActions.push('mail');

    return {
      ...employee,
      _access: {
        actions: availableActions,
      },
    };
  };

  const getEmployeeOrganizationName = async (_checker: PermissionChecker) => {
    const organizationName = await getOrganizationNameAcl();

    if (!organizationName) {
      throw new ApiError(404, 'Organization name not found');
    }

    return organizationName;
  };

  const getEmployeeByEmail = async (email: string) => {
    const employee = await employeeQueriesInstance.getEmployeeByEmail(email);

    if (!employee) {
      throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(email));
    }

    return employee;
  };

  const getAllEmployees = async (checker: PermissionChecker, query?: string, limit?: number) => {
    return employeeQueriesInstance.getAllEmployees(query, limit);
  };

  const queryEmployees = async (checker: PermissionChecker, query: string) => {
    return employeeQueriesInstance.queryEmployees(query);
  };

  const getEmployeesById = async (checker: PermissionChecker, employeeIds: CUID[]) => {
    return employeeQueriesInstance.getEmployeesById(employeeIds);
  };

  const getEmployeesCount = async (_checker: PermissionChecker) => {
    return employeeQueriesInstance.getEmployeesCount();
  };

  const deleteAllEmployees = async (_checker: PermissionChecker) => {
    return employeeRepositoryInstance.deleteAllEmployees();
  };

  const getAllEmployeesList = async (
    checker: PermissionChecker,
    page: number,
    search: string,
    orderBy: EmployeeListOrderBy = 'lastName-asc',
    perPage: number = ITEMS_PER_PAGE,
    filters: EmployeeStatusDto[] = [],
  ): Promise<EmployeeListDto> => {
    // Check permissions and scope
    const canView = checker.can(ResourceType.EMPLOYEES, PermissionAction.VIEW);
    const viewScope = checker.getScope(ResourceType.EMPLOYEES);
    const canCreate = checker.can(ResourceType.EMPLOYEES, PermissionAction.CREATE);
    const canEdit = checker.can(ResourceType.EMPLOYEES, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.EMPLOYEES, PermissionAction.DELETE);
    const canAssign = checker.can(ResourceType.EMPLOYEES, PermissionAction.ASSIGN);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view employees');
    }

    // If scope is SELF, filter to only show current user's employee record
    let employeeIdFilter: CUID | undefined;
    if (viewScope === PermissionScope.SELF) {
      const currentEmployee = await loadCurrentEmployee(checker.getIdentityId());
      if (!currentEmployee) {
        // User has no employee record, return empty list
        return {
          items: [],
          totalItems: 0,
          totalPages: 0,
          nextPage: null,
          prevPage: null,
          _access: {
            columns: [],
            actions: [],
          },
        };
      }
      employeeIdFilter = currentEmployee.id;
    }

    // Filter out invalid status values - only ACTIVE and ARCHIVED are valid
    const validFilters = (() => {
      const statusFilters = viewScope === PermissionScope.ALL ? filters : ['ACTIVE'];
      return statusFilters.filter((f): f is EmployeeStatusDto => f === 'ACTIVE' || f === 'ARCHIVED');
    })();

    // Default to ACTIVE if no valid filters remain
    const finalFilters: EmployeeStatusDto[] = validFilters.length > 0 ? validFilters : ['ACTIVE'];

    const paginatedData = await employeeQueriesInstance.getAllEmployeesList(
      page,
      search,
      orderBy,
      perPage,
      finalFilters,
      employeeIdFilter, // Pass employee ID filter for SELF scope
    );

    // Determine visible columns based on permissions
    const visibleColumns: (keyof (typeof paginatedData.items)[0])[] = ['lastName', 'firstName'];

    if (viewScope === PermissionScope.ALL) {
      visibleColumns.push('role', 'phone', 'workEmail', 'status');
    } else {
      visibleColumns.push('role', 'phone', 'workEmail');
    }

    // Determine available actions based on permissions
    const availableActions: EmployeeAction[] = [];

    // SELF scope users cannot create/delete/assign
    if (viewScope === PermissionScope.ALL) {
      if (canCreate) availableActions.push('create');
      if (canDelete) availableActions.push('archive');
      if (canAssign) availableActions.push('assign');
      if (canView) availableActions.push('filter', 'generate-cv');
    }

    // Edit available for both ALL and SELF (with SELF limited to own data)
    if (canEdit) availableActions.push('select', 'edit');

    // Mail is available to everyone
    availableActions.push('mail');

    return {
      ...paginatedData,
      _access: {
        columns: visibleColumns,
        actions: availableActions,
      },
    };
  };

  const updateEmployeeStatus = async (employeeId: CUID, status: EmployeeStatusDto) => {
    updateEmployeeStatusUseCase(employeeRepositoryInstance)(employeeId, status);
  };

  const isWorkEmailTaken = async (email: string) => {
    const employee = await employeeQueriesInstance.getEmployeeByEmail(email);

    return !!employee;
  };

  const archiveEmployee = async (checker: PermissionChecker, employeeId: string) => {
    await archiveEmployeeUseCase(employeeRepositoryInstance)(employeeId);
  };

  const validateEmployeeStatus = async (employeeId: CUID) => {
    await validateEmployeeStatusUseCase(employeeQueriesInstance)(employeeId);
  };

  const getEmployeeByDocumentId = async (checker: PermissionChecker, documentId: CUID) => {
    const employee = await employeeQueriesInstance.getEmployeeByDocumentId(documentId);

    if (!employee) {
      throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(documentId));
    }

    return employee;
  };

  const getEmployeesBySkillIds = async (checker: PermissionChecker, skillIds: CUID[]) => {
    const skills = await employeeSkillQueriesImpl.getEmployeeSkillsByIds(skillIds);

    if (!skills.length) return [];

    return skills.map((skill) => skill.employeeId);
  };

  return {
    createEmployee: privateRoute(createEmployee),
    getEmployeeGeneralInfo: privateRoute(getEmployeeGeneralInfo),
    getAllEmployees: privateRoute(getAllEmployees),
    updateEmployeeGeneralInfo: privateRoute(updateEmployeeGeneralInfo),
    getEmployeeById: privateRoute(getEmployeeById),
    getEmployeeOrganizationName: privateRoute(getEmployeeOrganizationName),
    getEmployeeByEmail,
    getAllEmployeesList: privateRoute(getAllEmployeesList),
    updateEmployeeStatus,
    isWorkEmailTaken,
    archiveEmployee: isOwnerRoute(archiveEmployee),
    validateEmployeeStatus,
    getEmployeeByDocumentId: requirePermission(
      ResourceType.COMPANY_DOCUMENTS,
      PermissionAction.VIEW,
      getEmployeeByDocumentId,
    ),
    queryEmployees: privateRoute(queryEmployees),
    getEmployeesById: privateRoute(getEmployeesById),
    getEmployeeBySkillIds: privateRoute(getEmployeesBySkillIds),
    deleteAllEmployees: isOwnerRoute(deleteAllEmployees),
    getEmployeesCount: privateRoute(getEmployeesCount),
  };
}
