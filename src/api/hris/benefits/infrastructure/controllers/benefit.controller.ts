import { type OrganizationContext } from '@/api/hris';
import { requirePermission, privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction, PermissionScope } from '@/api/hris/authorization/permissions';
import { type CUID, type Nullable, ITEMS_PER_PAGE, ApiError } from '@/shared';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';
import { benefitRepository } from '../database/repositories';
import { benefitQueries, type BenefitOrderBy, type EmployeeBenefitOrderBy } from '../database/queries';
import {
  createBenefitUseCase,
  updateBenefitUseCase,
  deleteBenefitUseCase,
  assignBenefitUseCase,
  unassignBenefitUseCase,
} from '../../model/use-cases';
import {
  type CreateBenefitDto,
  type UpdateBenefitDto,
  type BenefitDto,
  type BenefitListWithAccessDto,
  type EmployeeBenefitListWithAccessDto,
  type BenefitAction,
  type BenefitListItemDto,
  type EmployeeBenefitListItemDto,
} from '../../model/dtos';

export type BenefitsController = {
  createBenefit: (data: CreateBenefitDto) => Promise<CUID>;
  updateBenefit: (benefitId: CUID, data: UpdateBenefitDto) => Promise<void>;
  deleteBenefit: (benefitId: CUID) => Promise<void>;
  getBenefitList: (
    page?: number,
    orderBy?: BenefitOrderBy,
    query?: string,
    perPage?: number,
  ) => Promise<BenefitListWithAccessDto>;
  getBenefitById: (benefitId: CUID) => Promise<Nullable<BenefitDto>>;
  assignBenefit: (benefitId: CUID, employeeId: CUID, startDate: Date) => Promise<void>;
  assignBenefitsToEmployees: (benefitIds: CUID[], employeeIds: CUID[], startDate: Date) => Promise<void>;
  unassignBenefit: (employeeBenefitId: CUID) => Promise<void>;
  unassignBenefits: (employeeBenefitIds: CUID[]) => Promise<void>;
  getEmployeeBenefitList: (
    employeeId: CUID,
    page?: number,
    orderBy?: EmployeeBenefitOrderBy,
    perPage?: number,
  ) => Promise<EmployeeBenefitListWithAccessDto>;
  getEmployeesWithBenefits: (
    page?: number,
    orderBy?: EmployeeBenefitOrderBy,
    query?: string,
    perPage?: number,
  ) => Promise<EmployeeBenefitListWithAccessDto>;
  getEmployeeCountByBenefitId: (benefitId: CUID) => Promise<number>;
};

export function benefitsController(organizationContext: OrganizationContext): BenefitsController {
  const benefitRepositoryImpl = benefitRepository(organizationContext.db);
  const benefitQueriesImpl = benefitQueries(organizationContext);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  const createBenefit = async (checker: PermissionChecker, data: CreateBenefitDto): Promise<CUID> => {
    // Check if user can create benefits
    const canCreate = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.CREATE);
    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create benefits');
    }

    return await createBenefitUseCase(benefitRepositoryImpl)(data);
  };

  const updateBenefit = async (
    checker: PermissionChecker,
    benefitId: CUID,
    data: UpdateBenefitDto,
  ): Promise<void> => {
    // Check if user can edit benefits
    const canEdit = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.EDIT);
    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit benefits');
    }

    await updateBenefitUseCase(benefitRepositoryImpl)(benefitId, data);
  };

  const deleteBenefit = async (checker: PermissionChecker, benefitId: CUID): Promise<void> => {
    // Check if user can delete benefits
    const canDelete = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.DELETE);
    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete benefits');
    }

    await deleteBenefitUseCase(benefitRepositoryImpl)(benefitId);
  };

  const getBenefitList = async (
    checker: PermissionChecker,
    page: number = 1,
    orderBy?: BenefitOrderBy,
    query?: string,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<BenefitListWithAccessDto> => {
    // Check if user can view benefits
    const canView = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view benefits');
    }

    const canCreate = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.CREATE);
    const canEdit = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.DELETE);
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);

    const data = await benefitQueriesImpl.getBenefitList(page, orderBy, query, perPage);

    const accessibleColumns: (keyof BenefitListItemDto)[] = [
      'id',
      'name',
      'note',
      'assignedEmployees',
      'createdAt',
    ];

    const accessibleActions: BenefitAction[] = ['select'];
    if (canCreate) accessibleActions.push('create');
    if (canEdit) accessibleActions.push('edit');
    if (canDelete) accessibleActions.push('delete');
    if (canAssign) accessibleActions.push('assign', 'unassign');

    return {
      ...data,
      _access: {
        columns: accessibleColumns,
        actions: accessibleActions,
      },
    };
  };

  const getBenefitById = async (
    checker: PermissionChecker,
    benefitId: CUID,
  ): Promise<Nullable<BenefitDto>> => {
    // Check if user can view benefits (company level) or employee profile (for viewing employee benefits)
    const canViewCompany = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);
    const canViewEmployee = checker.can(ResourceType.EMPLOYEE_PROFILE, PermissionAction.VIEW);

    if (!canViewCompany && !canViewEmployee) {
      throw new ApiError(403, 'Forbidden: No permission to view benefits');
    }

    // If employee profile permission with SELF scope, verify the benefit is assigned to the employee
    if (canViewEmployee && !canViewCompany) {
      const employeeScope = checker.getScope(ResourceType.EMPLOYEE_PROFILE);
      if (employeeScope === PermissionScope.SELF) {
        const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
        if (!currentEmployee) {
          throw new ApiError(403, 'Forbidden: Can only view own benefits');
        }
        // Check if benefit is assigned to this employee
        const employeeBenefit = await benefitRepositoryImpl.getEmployeeBenefitByBenefitAndEmployee(
          benefitId,
          currentEmployee.id,
        );
        if (!employeeBenefit) {
          throw new ApiError(403, 'Forbidden: Can only view own benefits');
        }
      }
    }

    return await benefitRepositoryImpl.getBenefitById(benefitId);
  };

  const assignBenefit = async (
    checker: PermissionChecker,
    benefitId: CUID,
    employeeId: CUID,
    startDate: Date,
  ): Promise<void> => {
    // Check if user can assign benefits
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);
    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to assign benefits');
    }

    await assignBenefitUseCase(benefitRepositoryImpl)(benefitId, employeeId, startDate);
  };

  const assignBenefitsToEmployees = async (
    checker: PermissionChecker,
    benefitIds: CUID[],
    employeeIds: CUID[],
    startDate: Date,
  ): Promise<void> => {
    // Check if user can assign benefits
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);
    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to assign benefits');
    }

    // Assign multiple benefits to multiple employees
    await Promise.all(
      benefitIds.flatMap((benefitId) =>
        employeeIds.map((employeeId) =>
          assignBenefitUseCase(benefitRepositoryImpl)(benefitId, employeeId, startDate),
        ),
      ),
    );
  };

  const unassignBenefit = async (checker: PermissionChecker, employeeBenefitId: CUID): Promise<void> => {
    // Check if user can assign benefits (unassign requires same permission)
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);
    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to unassign benefits');
    }

    await unassignBenefitUseCase(benefitRepositoryImpl)(employeeBenefitId);
  };

  const unassignBenefits = async (checker: PermissionChecker, employeeBenefitIds: CUID[]): Promise<void> => {
    // Check if user can assign benefits (unassign requires same permission)
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);
    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to unassign benefits');
    }

    await Promise.all(employeeBenefitIds.map((id) => unassignBenefitUseCase(benefitRepositoryImpl)(id)));
  };

  const getEmployeeBenefitList = async (
    checker: PermissionChecker,
    employeeId: CUID,
    page: number = 1,
    orderBy?: EmployeeBenefitOrderBy,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<EmployeeBenefitListWithAccessDto> => {
    // Check if user can view benefits (company level) or employee profile (for viewing employee benefits)
    const canViewCompany = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);
    const canViewEmployee = checker.can(ResourceType.EMPLOYEE_PROFILE, PermissionAction.VIEW);
    const employeeScope = checker.getScope(ResourceType.EMPLOYEE_PROFILE);

    if (!canViewCompany && !canViewEmployee) {
      throw new ApiError(403, 'Forbidden: No permission to view benefits');
    }

    // If employee profile permission with SELF scope, verify ownership
    if (canViewEmployee && employeeScope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only view own benefits');
      }
    }

    const canEdit = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.DELETE);
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);

    const data = await benefitQueriesImpl.getEmployeeBenefitList(employeeId, page, orderBy, perPage);

    const accessibleColumns: (keyof EmployeeBenefitListItemDto)[] = [
      'id',
      'benefitId',
      'employeeId',
      'startDate',
      'benefit',
      'employee',
    ];

    const accessibleActions: BenefitAction[] = ['select'];
    if (canEdit) accessibleActions.push('edit');
    if (canDelete) accessibleActions.push('delete');
    if (canAssign) accessibleActions.push('unassign');

    return {
      ...data,
      _access: {
        columns: accessibleColumns,
        actions: accessibleActions,
      },
    };
  };

  const getEmployeesWithBenefits = async (
    checker: PermissionChecker,
    page: number = 1,
    orderBy?: EmployeeBenefitOrderBy,
    query?: string,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<EmployeeBenefitListWithAccessDto> => {
    // Check if user can view benefits
    const canView = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view benefits');
    }

    const canEdit = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.EDIT);
    const canDelete = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.DELETE);
    const canAssign = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN);

    const data = await benefitQueriesImpl.getEmployeesWithBenefits(page, orderBy, query, perPage);

    const accessibleColumns: (keyof EmployeeBenefitListItemDto)[] = [
      'id',
      'benefitId',
      'employeeId',
      'startDate',
      'benefit',
      'employee',
    ];

    const accessibleActions: BenefitAction[] = ['select'];
    if (canEdit) accessibleActions.push('edit');
    if (canDelete) accessibleActions.push('delete');
    if (canAssign) accessibleActions.push('unassign');

    return {
      ...data,
      _access: {
        columns: accessibleColumns,
        actions: accessibleActions,
      },
    };
  };

  const getEmployeeCountByBenefitId = async (
    checker: PermissionChecker,
    benefitId: CUID,
  ): Promise<number> => {
    // Check if user can view benefits
    const canView = checker.can(ResourceType.COMPANY_BENEFITS, PermissionAction.VIEW);
    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view benefits');
    }

    return await benefitQueriesImpl.getEmployeeCountByBenefitId(benefitId);
  };

  return {
    createBenefit: requirePermission(ResourceType.COMPANY_BENEFITS, PermissionAction.CREATE, createBenefit),
    updateBenefit: requirePermission(ResourceType.COMPANY_BENEFITS, PermissionAction.EDIT, updateBenefit),
    deleteBenefit: requirePermission(ResourceType.COMPANY_BENEFITS, PermissionAction.DELETE, deleteBenefit),
    getBenefitList: privateRoute(getBenefitList),
    getBenefitById: privateRoute(getBenefitById),
    assignBenefit: requirePermission(ResourceType.COMPANY_BENEFITS, PermissionAction.ASSIGN, assignBenefit),
    assignBenefitsToEmployees: requirePermission(
      ResourceType.COMPANY_BENEFITS,
      PermissionAction.ASSIGN,
      assignBenefitsToEmployees,
    ),
    unassignBenefit: requirePermission(
      ResourceType.COMPANY_BENEFITS,
      PermissionAction.ASSIGN,
      unassignBenefit,
    ),
    unassignBenefits: requirePermission(
      ResourceType.COMPANY_BENEFITS,
      PermissionAction.ASSIGN,
      unassignBenefits,
    ),
    getEmployeeBenefitList: privateRoute(getEmployeeBenefitList),
    getEmployeesWithBenefits: privateRoute(getEmployeesWithBenefits),
    getEmployeeCountByBenefitId: privateRoute(getEmployeeCountByBenefitId),
  };
}
