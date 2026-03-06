import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentLocationRepository } from '../repository/equipment-location.repository';

export function deleteEquipmentLocationUseCase(repository: EquipmentLocationRepository) {
  return async (id: CUID) => {
    try {
      await repository.deleteEquipmentLocation(id);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.EQUIPMENT.DELETE_LOCATION_FAILED(id));
    }
  };
}
