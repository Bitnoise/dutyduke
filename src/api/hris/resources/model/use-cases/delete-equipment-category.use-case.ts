import { API_ERROR_MESSAGES, ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type EquipmentCategoryRepository } from '../repository/equipment-category.repository';

export function deleteEquipmentCategoryUseCase(repository: EquipmentCategoryRepository) {
  return async (id: CUID) => {
    try {
      await repository.deleteCategory(id);
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.EQUIPMENT.DELETE_CATEGORY_FAILED(id));
    }
  };
}
