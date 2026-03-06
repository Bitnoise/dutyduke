import { API_ERROR_MESSAGES, ApiError, type Nullable, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsCategoryRepository, type DocumentsRepository } from '../repositories';
import { type UpdateDocumentDto } from '../dtos';

export function updateDocumentsUseCase(
  repository: DocumentsRepository,
  documentsCategoryRepository: DocumentsCategoryRepository,
) {
  return async (documentIds: CUID[], data: UpdateDocumentDto) => {
    const { description, categoryId: category, expDate, status } = data;

    const trimmedCategoryName = category?.trim() || null;
    const expirationDateValue = expDate ? new Date(expDate) : null;
    const newDescription = documentIds.length > 1 ? undefined : description || undefined;

    let categoryId: Nullable<CUID> = trimmedCategoryName
      ? await documentsCategoryRepository.getCategoryByName(trimmedCategoryName).then((c) => c?.id ?? null)
      : null;

    try {
      if (!categoryId && trimmedCategoryName) {
        categoryId = await documentsCategoryRepository.createCategory(trimmedCategoryName);
      }

      const parsedUpdateData: UpdateDocumentDto = {
        categoryId,
        expDate: expirationDateValue,
        description: newDescription,
        status,
      };

      await Promise.all(
        documentIds.map((documentId) => repository.updateDocument(documentId, parsedUpdateData)),
      );
    } catch (err) {
      logger.info(err);
      throw new ApiError(400, API_ERROR_MESSAGES.DOCUMENTS.UPDATE_FAILED);
    }
  };
}
