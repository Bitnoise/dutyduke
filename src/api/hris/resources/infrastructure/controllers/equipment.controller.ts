import { type OrganizationContext } from '@/api/hris';
import {
  getLoggedIdentityId,
  requirePermission,
  privateRoute,
  type PermissionChecker,
} from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';
import { checkResourcePermission } from '@/api/hris/authorization/permissionChecker';
import { documentsAcl, employeesAcl } from '@/api/hris/resources/acl';
import { equipmentQueries } from '@/api/hris/resources/infrastructure/database/queries';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';
import {
  equipmentChangelogRepository,
  equipmentRepository,
} from '@/api/hris/resources/infrastructure/database/repositories';
import {
  type UpdateEquipmentDto,
  type CreateEquipmentDto,
  type EquipmentStatus,
  type EquipmentAssignStatus,
  type EquipmentListWithAccessDto,
  type EquipmentListItemDto,
  type EquipmentAction,
  type EquipmentGeneralDataWithAccessDto,
  type EquipmentDto,
} from '@/api/hris/resources/model/dtos';
import {
  assignEquipmentUseCase,
  createEquipmentUseCase,
  createLogUseCase,
  getAllEquipmentsUseCase,
  unassignEquipmentUseCase,
  updateEquipmentUseCase,
} from '@/api/hris/resources/model/use-cases';
import {
  type Nullable,
  type CUID,
  ITEMS_PER_PAGE,
  ApiError,
  type EquipmentOrderBy,
  API_ERROR_MESSAGES,
  type EquipmentListType,
  EQUIPMENT_ACCESSIBLE_COLS,
} from '@/shared';
import { EQUIPMENT_ERRORS } from '../../errors';

export type EquipmentController = {
  createEquipment(categoryId: CUID, locationId: Nullable<CUID>, equipment: CreateEquipmentDto): Promise<CUID>;
  updateEquipment(
    equipmentId: CUID,
    equipment: UpdateEquipmentDto,
    categoryId?: Nullable<CUID>,
    locationId?: Nullable<CUID>,
  ): Promise<void>;
  getEquipmentGeneralData(equipmentId: CUID): Promise<Nullable<EquipmentGeneralDataWithAccessDto>>;
  getEquipmentList(
    listType: EquipmentListType,
    page?: number,
    orderBy?: EquipmentOrderBy,
    statusFilter?: EquipmentStatus[],
    assignFilter?: EquipmentAssignStatus[],
    perPage?: number,
    categoryId?: CUID,
    query?: string,
    assigneeId?: CUID,
    equipmentIds?: CUID[],
  ): Promise<EquipmentListWithAccessDto>;
  assignEquipment: (equipmentId: CUID, assigneeId: CUID) => Promise<void>;
  unassignEquipment: (equipmentId: CUID) => Promise<void>;
  getEquipmentById: (equipmentId: CUID) => Promise<Nullable<EquipmentDto>>;
  getAllEquipments: (
    category?: string,
    status?: string,
    filter?: string,
    assigneeId?: CUID,
  ) => Promise<EquipmentDto[]>;
  updateEquipmentStatus: (id: CUID, status: EquipmentStatus, description: string) => Promise<void>;
};

export function equipmentController(organizationContext: OrganizationContext): EquipmentController {
  const equipmentRepositoryImpl = equipmentRepository(organizationContext.db);
  const equipmentQueriesImpl = equipmentQueries(organizationContext);
  const documentsAclImpl = documentsAcl(organizationContext);
  const equipmentChangelogRepositoryImpl = equipmentChangelogRepository(organizationContext.db);
  const employeesAclImpl = employeesAcl(organizationContext);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  const createEquipment = async (
    checker: PermissionChecker,
    categoryId: CUID,
    locationId: Nullable<CUID>,
    equipment: CreateEquipmentDto,
  ) => {
    // Check if user can create equipment
    const canCreate = checker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.CREATE);
    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create equipment');
    }

    return createEquipmentUseCase(equipmentRepositoryImpl, documentsAclImpl)(
      categoryId,
      locationId,
      equipment,
    );
  };

  const updateEquipment = async (
    checker: PermissionChecker,
    equipmentId: CUID,
    equipment: UpdateEquipmentDto,
    categoryId?: CUID,
    locationId?: CUID,
  ) => {
    // Check if user can edit equipment (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.EDIT,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to edit equipment');
    }

    const equipmentToUpdate = await equipmentQueriesImpl.getEquipmentById(equipmentId);

    if (!equipmentToUpdate) {
      throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
    }

    const currentAvatarId = equipmentToUpdate.avatarId;

    const updatedEquipment = await updateEquipmentUseCase(equipmentRepositoryImpl, documentsAclImpl)(
      equipmentId,
      equipment,
      currentAvatarId,
      categoryId && equipmentToUpdate.categoryId !== categoryId ? categoryId : undefined,
      locationId !== undefined && equipmentToUpdate.locationId !== locationId ? locationId : undefined,
    );

    await createLogUseCase(equipmentChangelogRepositoryImpl)(
      equipmentToUpdate,
      updatedEquipment,
      await getLoggedIdentityId(),
    );
  };

  const getEquipmentList = async (
    checker: PermissionChecker,
    listType: EquipmentListType,
    page: number = 1,
    orderBy: EquipmentOrderBy = 'signature-asc',
    statusFilter: EquipmentStatus[] = ['WORKING', 'IN_SERVICE', 'BROKEN', 'ARCHIVED'],
    assignFilter: EquipmentAssignStatus[] = ['ASSIGNED', 'FREE'],
    perPage = ITEMS_PER_PAGE,
    categoryId?: CUID,
    query?: string,
    assigneeId?: CUID,
    equipmentIds?: CUID[],
  ) => {
    // Check if user can view equipment (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view equipment');
    }

    // If employee permission with SELF scope, filter to only show equipment assigned to the user's employee record
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
          _access: {
            columns: EQUIPMENT_ACCESSIBLE_COLS[listType].EMPLOYEE,
            actions: ['select'] as EquipmentAction[],
          },
        };
      }
      // Override assigneeId to only show equipment assigned to current employee
      assigneeId = currentEmployee.id;
    }

    const canCreate = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.CREATE,
    ).hasPermission;
    const canEdit = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.EDIT,
    ).hasPermission;
    const canDelete = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.DELETE,
    ).hasPermission;
    const canAssign = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.ASSIGN,
    ).hasPermission;
    const canView = permissionCheck.hasPermission;

    // Filter based on permissions
    // If user has VIEW permission, they can see all statuses and use the provided filters
    // If user doesn't have VIEW permission, restrict to basic statuses and assigned only
    const filteredStatusFilter: EquipmentStatus[] = canView
      ? statusFilter.length > 0
        ? statusFilter
        : ['WORKING', 'IN_SERVICE', 'BROKEN', 'ARCHIVED']
      : ['WORKING', 'IN_SERVICE'];
    // Default to showing both ASSIGNED and FREE if no filter is provided or if empty array
    const defaultAssignFilter: EquipmentAssignStatus[] = ['ASSIGNED', 'FREE'];
    const filteredAssignFilter: EquipmentAssignStatus[] = canView
      ? assignFilter.length > 0
        ? assignFilter
        : defaultAssignFilter
      : ['ASSIGNED'];

    const data = await equipmentQueriesImpl.getEquipmentList(
      page,
      orderBy,
      filteredStatusFilter,
      filteredAssignFilter,
      perPage,
      categoryId,
      query,
      assigneeId,
      equipmentIds,
    );

    const hasAnyManagementPermission = canCreate || canEdit || canDelete || canAssign;
    let accessibleColumns: (keyof EquipmentListItemDto)[] = [];
    let accessibleActions: EquipmentAction[] = [];

    if (hasAnyManagementPermission) {
      accessibleColumns = EQUIPMENT_ACCESSIBLE_COLS[listType].OWNER;
      accessibleActions = [];
      if (canView) accessibleActions.push('filter', 'select');
      if (canCreate) accessibleActions.push('create');
      if (canAssign) accessibleActions.push('assign');
      if (canEdit) accessibleActions.push('edit', 'duplicate', 'changeStatus');
      if (canDelete) accessibleActions.push('archive');
    } else {
      accessibleColumns = EQUIPMENT_ACCESSIBLE_COLS[listType].EMPLOYEE;
      accessibleActions = ['select'];
    }

    return {
      ...data,
      _access: {
        columns: accessibleColumns,
        actions: accessibleActions,
      },
    };
  };

  const assignEquipment = async (checker: PermissionChecker, equipmentId: CUID, assigneeId: CUID) => {
    // Check if user can assign equipment (company or employee level)
    const assignCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.ASSIGN,
    );
    if (!assignCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to assign equipment');
    }

    const equipmentToUpdate = await equipmentQueriesImpl.getEquipmentById(equipmentId);
    await employeesAclImpl.validateEmployeeStatus(assigneeId);

    if (!equipmentToUpdate) {
      throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
    }

    const updatedEquipment = await assignEquipmentUseCase(equipmentRepositoryImpl)(equipmentId, assigneeId);

    await createLogUseCase(equipmentChangelogRepositoryImpl)(
      { assigneeId: equipmentToUpdate.assigneeId },
      { assigneeId: updatedEquipment.assigneeId },
      await getLoggedIdentityId(),
    );
  };

  const unassignEquipment = async (checker: PermissionChecker, equipmentId: CUID) => {
    // Check if user can assign equipment (unassign requires same permission, company or employee level)
    const unassignCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.ASSIGN,
    );
    if (!unassignCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to unassign equipment');
    }

    const equipmentToUpdate = await equipmentQueriesImpl.getEquipmentById(equipmentId);

    if (!equipmentToUpdate) {
      throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
    }

    const updatedEquipment = await unassignEquipmentUseCase(equipmentRepositoryImpl)(equipmentId);

    await createLogUseCase(equipmentChangelogRepositoryImpl)(
      { assigneeId: equipmentToUpdate.assigneeId },
      { assigneeId: updatedEquipment.assigneeId },
      await getLoggedIdentityId(),
    );
  };

  const getEquipmentGeneralData = async (checker: PermissionChecker, equipmentId: CUID) => {
    // Check if user can view equipment (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view equipment');
    }

    // If employee permission with SELF scope, verify ownership
    if (permissionCheck.requiresOwnershipVerification) {
      const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
      if (!equipment) {
        throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
      }

      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || equipment.assigneeId !== currentEmployee.id) {
        throw new ApiError(403, 'Forbidden: Can only view own equipment');
      }
    }

    const canView = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.VIEW,
    ).hasPermission;
    const canCreate = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.CREATE,
    ).hasPermission;
    const canEdit = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.EDIT,
    ).hasPermission;
    const canDelete = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.DELETE,
    ).hasPermission;
    const canAssign = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.ASSIGN,
    ).hasPermission;

    const equipment = await equipmentQueriesImpl.getEquipmentGeneralData(equipmentId);

    if (!equipment) return null;

    const accessibleActions: EquipmentAction[] = [];
    if (canView) accessibleActions.push('filter', 'select');
    if (canCreate) accessibleActions.push('create');
    if (canAssign) accessibleActions.push('assign');
    if (canEdit) accessibleActions.push('edit', 'duplicate');
    if (canDelete) accessibleActions.push('archive');

    return {
      ...equipment,
      _access: {
        actions: accessibleActions,
      },
    };
  };

  const getAllEquipments = async (
    checker: PermissionChecker,
    category?: string,
    status?: string,
    filter?: string,
    assigneeId?: CUID,
  ) => {
    // Check if user can view equipment (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view equipment');
    }

    // If employee permission with SELF scope, filter to only show equipment assigned to the user's employee record
    if (permissionCheck.requiresOwnershipVerification) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee) {
        // User has no employee record, return empty list
        return [];
      }
      // Override assigneeId to only show equipment assigned to current employee
      assigneeId = currentEmployee.id;
    }

    const equipments = await getAllEquipmentsUseCase(equipmentQueriesImpl)(
      category,
      status,
      filter,
      assigneeId,
    );

    if (!equipments) {
      throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND);
    }

    return equipments;
  };

  const updateEquipmentStatus = async (
    checker: PermissionChecker,
    id: CUID,
    status: EquipmentStatus,
    description: string,
  ) => {
    // Check if user can edit equipment (company or employee level)
    const editCheck = checkResourcePermission(checker, ResourceType.COMPANY_EQUIPMENT, PermissionAction.EDIT);
    if (!editCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to update equipment status');
    }

    const equipment = await equipmentRepositoryImpl.getEquipmentById(id);
    if (!equipment) {
      throw new ApiError(404, API_ERROR_MESSAGES.EQUIPMENT.NOT_FOUND(id));
    }

    await equipmentRepositoryImpl.updateEquipmentStatus(equipment.id, status, description);
  };

  const getEquipmentById = async (checker: PermissionChecker, equipmentId: CUID) => {
    // Check if user can view equipment (company or employee level)
    const permissionCheck = checkResourcePermission(
      checker,
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.VIEW,
    );
    if (!permissionCheck.hasPermission) {
      throw new ApiError(403, 'Forbidden: No permission to view equipment');
    }

    // If employee permission with SELF scope, verify ownership
    if (permissionCheck.requiresOwnershipVerification) {
      const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
      if (!equipment) {
        throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
      }

      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || equipment.assigneeId !== currentEmployee.id) {
        throw new ApiError(403, 'Forbidden: Can only view own equipment');
      }
    }

    return equipmentQueriesImpl.getEquipmentById(equipmentId);
  };

  return {
    createEquipment: requirePermission(
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.CREATE,
      createEquipment,
    ),
    updateEquipment: privateRoute(updateEquipment),
    getEquipmentGeneralData: privateRoute(getEquipmentGeneralData),
    getEquipmentList: privateRoute(getEquipmentList),
    assignEquipment: privateRoute(assignEquipment),
    unassignEquipment: privateRoute(unassignEquipment),
    getEquipmentById: privateRoute(getEquipmentById),
    getAllEquipments: privateRoute(getAllEquipments),
    updateEquipmentStatus: privateRoute(updateEquipmentStatus),
  } satisfies EquipmentController;
}
