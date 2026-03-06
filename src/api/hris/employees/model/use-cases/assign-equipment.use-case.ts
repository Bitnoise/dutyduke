import { type ResourcesAcl } from '@/api/hris/employees/model/acl';
import { type CUID } from '@/shared';

export function assignEquipmentUseCase(resourcesAcl: ResourcesAcl) {
  return async (equipmentId: CUID, employeeId: CUID) => {
    await resourcesAcl.assignEquipment(equipmentId, employeeId);
  };
}
