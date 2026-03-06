import { EQUIPMENT_CATEGORY_ERRORS } from '@/api/hris/resources/errors';
import { type EquipmentCategoryRepository } from '@/api/hris/resources/model/repository';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';

export function createEquipmentCategoryUseCase(repository: EquipmentCategoryRepository) {
  return async (name: string) => {
    const existingCategory = await repository.getCategoryByName(name);

    if (existingCategory) {
      throw new ApiError(409, EQUIPMENT_CATEGORY_ERRORS.ALREADY_EXISTS(name));
    }

    try {
      const categoryId = await repository.createCategory(name);

      return categoryId;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, EQUIPMENT_CATEGORY_ERRORS.CREATE_FAILED);
    }
  };
}
