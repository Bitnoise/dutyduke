import { type OrganizationContext } from '@/api/hris';
import { requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction, PermissionScope } from '@/api/hris/authorization/permissions';
import { resourcesAcl } from '@/api/hris/employees/infrastructure/acl';
import { assignEquipmentUseCase, unassignEquipmentUseCase } from '@/api/hris/employees/model/use-cases';
import { ApiError, type CUID } from '@/shared';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';
import { equipmentQueries } from '@/api/hris/resources/infrastructure/database/queries';

export type EmployeeEquipmentController = {
  assignEquipment: (equipmentId: CUID, employeeId: CUID) => Promise<void>;
  unassignEquipment: (equipmentId: CUID) => Promise<void>;
};

export function employeeEquipmentController(
  organizationContext: OrganizationContext,
): EmployeeEquipmentController {
  const resourcesAclImpl = resourcesAcl(organizationContext);
  const employeeQueriesImpl = employeeQueries(organizationContext);
  const equipmentQueriesImpl = equipmentQueries(organizationContext);

  const assignEquipment = async (checker: PermissionChecker, equipmentId: CUID, employeeId: CUID) => {
    // Check if user can assign equipment
    const canAssign = checker.can(ResourceType.EMPLOYEE_EQUIPMENT, PermissionAction.ASSIGN);
    const scope = checker.getScope(ResourceType.EMPLOYEE_EQUIPMENT);

    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to assign equipment');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        throw new ApiError(403, 'Forbidden: Can only assign equipment to own employee record');
      }
    }

    await assignEquipmentUseCase(resourcesAclImpl)(equipmentId, employeeId);
  };

  const unassignEquipment = async (checker: PermissionChecker, equipmentId: CUID) => {
    // Check if user can assign equipment (unassign requires same permission)
    const canAssign = checker.can(ResourceType.EMPLOYEE_EQUIPMENT, PermissionAction.ASSIGN);
    const scope = checker.getScope(ResourceType.EMPLOYEE_EQUIPMENT);

    if (!canAssign) {
      throw new ApiError(403, 'Forbidden: No permission to unassign equipment');
    }

    // For unassign, we need to check if the equipment is assigned to the user's employee record if SELF scope
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee) {
        throw new ApiError(403, 'Forbidden: Can only unassign equipment from own employee record');
      }

      // Verify the equipment is actually assigned to the current user's employee record
      const equipment = await equipmentQueriesImpl.getEquipmentById(equipmentId);
      if (!equipment) {
        throw new ApiError(404, 'Equipment not found');
      }
      if (!equipment.assigneeId || equipment.assigneeId !== currentEmployee.id) {
        throw new ApiError(403, 'Forbidden: Can only unassign equipment from own employee record');
      }
    }

    await unassignEquipmentUseCase(resourcesAclImpl)(equipmentId);
  };

  return {
    assignEquipment: requirePermission(
      ResourceType.EMPLOYEE_EQUIPMENT,
      PermissionAction.ASSIGN,
      assignEquipment,
    ),
    unassignEquipment: requirePermission(
      ResourceType.EMPLOYEE_EQUIPMENT,
      PermissionAction.ASSIGN,
      unassignEquipment,
    ),
  };
}
