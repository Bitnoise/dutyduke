import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import { type EquipmentRepository } from '@/api/hris/resources/model/repository';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentDto } from '../dtos';

export function unassignEquipmentUseCase(repository: EquipmentRepository) {
  return async (equipmentId: CUID): Promise<EquipmentDto> => {
    try {
      const updatedEquipment = await repository.unassignEquipment(equipmentId);

      return updatedEquipment;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_ERRORS.UNASSIGN_FAILED);
    }
  };
}
