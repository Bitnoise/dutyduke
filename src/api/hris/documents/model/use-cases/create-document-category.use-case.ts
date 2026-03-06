import { EQUIPMENT_CATEGORY_ERRORS } from '@/api/hris/resources/errors';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsCategoryRepository } from '../repositories';

export function createDocumentCategoryUseCase(repository: DocumentsCategoryRepository) {
  return async (name: string) => {
    const existingCategory = await repository.getCategoryByName(name);

    if (existingCategory) {
      throw new ApiError(409, 'Category already exists');
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
