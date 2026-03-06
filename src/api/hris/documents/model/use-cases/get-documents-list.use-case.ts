import { ApiError, type CUID, type Nullable, type DocumentsOrderBy } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type DocumentsAssignStatus, type DocumentsStatus, type DocumentsListDto } from '../dtos';
import { type DocumentsQueries } from '../../infrastructure/database/queries';
import { DOCUMENTS_ERRORS } from '../../errors';

export function getDocumentsListUseCase(documentsQueries: DocumentsQueries) {
  return async (
    page: number,
    perPage: number,
    orderBy: DocumentsOrderBy,
    statusFilter: DocumentsStatus[],
    assignFilter: DocumentsAssignStatus[],
    categoryId: Nullable<CUID>,
    query?: string,
    expDate?: boolean,
  ): Promise<DocumentsListDto> => {
    try {
      const documents = await documentsQueries.getDocumentsList(
        page,
        orderBy,
        statusFilter,
        assignFilter,
        categoryId,
        query,
        expDate,
        perPage,
      );

      return documents;
    } catch (err) {
      logger.info(err);
      throw new ApiError(404, DOCUMENTS_ERRORS.NOT_FOUND);
    }
  };
}
