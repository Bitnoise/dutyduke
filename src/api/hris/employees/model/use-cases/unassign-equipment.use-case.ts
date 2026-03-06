import { type ResourcesAcl } from '@/api/hris/employees/model/acl';
import { type CUID } from '@/shared';

export function unassignEquipmentUseCase(resourcesAcl: ResourcesAcl) {
  return async (equipmentId: CUID) => {
    await resourcesAcl.unassignEquipment(equipmentId);
  };
}
