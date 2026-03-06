import { ApiError, type CUID, type Nullable } from '@/shared';
import { EQUIPMENT_ERRORS } from '../../errors';
import { type EquipmentDto } from '../dtos';

export function validateEquipmentStatusUseCase(equipment: Nullable<EquipmentDto>, equipmentId: CUID) {
  if (!equipment) {
    throw new ApiError(404, EQUIPMENT_ERRORS.NOT_FOUND_BY_ID(equipmentId));
  }

  if (equipment.status === 'ARCHIVED') {
    throw new ApiError(403, EQUIPMENT_ERRORS.ARCHIVED);
  }
}
