import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsCategoryRepository } from '../repositories';

export function deleteDocumentCategoryUseCase(documentCategoryRepository: DocumentsCategoryRepository) {
  return async (ids: CUID[] | 'all') => {
    try {
      await documentCategoryRepository.deleteCategories(ids === 'all' ? undefined : ids);
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, 'Deleting document categories failed');
    }
  };
}
