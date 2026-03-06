import { Decimal } from '@prisma/client/runtime/library';
import { ApiError, type CUID } from '@/shared';
import { type EmployeeEarningsSchema } from '@/api/hris/employees/infrastructure/controllers/schemas';
import {
  employeeQueries,
  employeesEarningsQueries,
} from '@/api/hris/employees/infrastructure/database/queries';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction, PermissionScope } from '@/api/hris/authorization/permissions';
import {
  type EmployeeEarningsWithAccessDto,
  type EmployeeEarningsDto,
} from '@/api/hris/employees/model/dtos';
import {
  deleteEmployeeEarningsUseCase,
  editEmployeeEarningsUseCase,
  validateEmployeeStatusUseCase,
} from '@/api/hris/employees/model/use-cases';
import { type OrganizationContext } from '@/api/hris';
import { employeeEarningsRepository } from '../database/repositories/employee-earnings.repository';
import { updateEmployeeEarningsUseCase } from '../../model/use-cases/update-employee-earnings.use-case';
import { EMPLOYEE_EARNINGS_ERROR_MESSAGES } from '../../errors';

export type EmployeesEarningsController = {
  getEmployeeEarnings: (employeeId: CUID) => Promise<EmployeeEarningsWithAccessDto>;
  getEmployeeEarningsById: (employeeId: CUID, earningId: CUID) => Promise<EmployeeEarningsDto>;
  updateEmployeeEarnings: (employeeId: CUID, earnings: EmployeeEarningsSchema) => Promise<void>;
  editEmployeeEarnings: (employeeId: CUID, id: CUID, earnings: EmployeeEarningsSchema) => Promise<void>;
  deleteEmployeeEarnings: (employeeId: CUID, earningId: CUID) => Promise<void>;
};

export function employeesEarningsController(
  organizationContext: OrganizationContext,
): EmployeesEarningsController {
  const employeeEarningsQueriesInstance = employeesEarningsQueries(organizationContext);
  const employeeEarningsRepositoryInstance = employeeEarningsRepository(organizationContext.db);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  const updateEmployeeEarnings = async (
    checker: PermissionChecker,
    employeeId: CUID,
    earnings: EmployeeEarningsSchema,
  ) => {
    // Check scope: if SELF, verify this is the current user's employee record
    const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only manage own earnings');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateEmployeeEarningsUseCase(employeeEarningsRepositoryInstance)({
      ...earnings,
      value: new Decimal(earnings.value),
      date: new Date(earnings.date),
    });
  };

  const editEmployeeEarnings = async (
    checker: PermissionChecker,
    employeeId: CUID,
    earningId: CUID,
    earnings: EmployeeEarningsSchema,
  ) => {
    // Check scope: if SELF, verify this is the current user's employee record
    const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only edit own earnings');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await editEmployeeEarningsUseCase(employeeEarningsRepositoryInstance)(earningId, {
      ...earnings,
      value: new Decimal(earnings.value),
      date: new Date(earnings.date),
    });
  };

  const deleteEmployeeEarnings = async (checker: PermissionChecker, employeeId: CUID, earningId: CUID) => {
    // Check scope: if SELF, verify this is the current user's employee record
    const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only delete own earnings');
      }
    }

    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    deleteEmployeeEarningsUseCase(employeeEarningsRepositoryInstance)(earningId);
  };

  const getEmployeeEarnings = async (checker: PermissionChecker, employeeId: CUID) => {
    // Check if user can view earnings
    const canView = checker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view earnings');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only view own earnings');
      }
    }

    const earnings = await employeeEarningsQueriesInstance.getEmployeeEarnings(employeeId);

    // Determine edit access based on permissions
    const canEdit = checker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.EDIT);
    const canCreate = checker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.CREATE);
    const canDelete = checker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.DELETE);

    return {
      earnings,
      _access: {
        edit: canEdit || canCreate,
        create: canCreate,
        delete: canDelete,
      },
    };
  };

  const getEmployeeEarningsById = async (checker: PermissionChecker, employeeId: CUID, earningId: CUID) => {
    // Check if user can view earnings
    const canView = checker.can(ResourceType.EMPLOYEE_EARNINGS, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_EARNINGS);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view earnings');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only view own earnings');
      }
    }

    const earning = await employeeEarningsQueriesInstance.getEmployeeEarningsById(employeeId, earningId);

    if (!earning) {
      throw new ApiError(404, EMPLOYEE_EARNINGS_ERROR_MESSAGES.NOT_FOUND_BY_ID(earningId));
    }

    return earning;
  };

  return {
    getEmployeeEarnings: privateRoute(getEmployeeEarnings),
    getEmployeeEarningsById: privateRoute(getEmployeeEarningsById),
    updateEmployeeEarnings: requirePermission(
      ResourceType.EMPLOYEE_EARNINGS,
      PermissionAction.CREATE,
      updateEmployeeEarnings,
    ),
    editEmployeeEarnings: requirePermission(
      ResourceType.EMPLOYEE_EARNINGS,
      PermissionAction.EDIT,
      editEmployeeEarnings,
    ),
    deleteEmployeeEarnings: requirePermission(
      ResourceType.EMPLOYEE_EARNINGS,
      PermissionAction.DELETE,
      deleteEmployeeEarnings,
    ),
  };
}
