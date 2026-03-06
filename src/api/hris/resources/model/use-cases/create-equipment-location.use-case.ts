import { EQUIPMENT_LOCATION_ERRORS } from '@/api/hris/resources/errors';
import { type EquipmentLocationRepository } from '@/api/hris/resources/model/repository';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';

export function createEquipmentLocationUseCase(repository: EquipmentLocationRepository) {
  return async (name: string) => {
    const existingLocation = await repository.getEquipmentLocationByName(name);

    if (existingLocation) {
      throw new ApiError(409, EQUIPMENT_LOCATION_ERRORS.ALREADY_EXISTS_BY_NAME(name));
    }

    try {
      const createdLocationId = await repository.createEquipmentLocation(name);

      return createdLocationId;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_LOCATION_ERRORS.CREATE_FAILED);
    }
  };
}
