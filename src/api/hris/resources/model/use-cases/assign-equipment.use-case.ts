import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import { type EquipmentRepository } from '@/api/hris/resources/model/repository';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentDto } from '../dtos';

export function assignEquipmentUseCase(repository: EquipmentRepository) {
  return async (equipmentId: CUID, assigneeId: CUID): Promise<EquipmentDto> => {
    try {
      const updatedEquipment = await repository.assignEquipment(equipmentId, assigneeId);

      return updatedEquipment;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_ERRORS.ASSIGN_FAILED);
    }
  };
}
