'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { handleActionError, HRIS_ROUTES } from '@/shared';
import { DOCUMENTS_ERRORS } from '@/api/hris/documents/errors';
import { logger } from '@/shared/service/pino';
import { type DeleteDocumentSchema } from '../_schemas';
import { type DeleteDocumentState } from './types';

export async function deleteDocuments(prevState: DeleteDocumentState): Promise<DeleteDocumentState> {
  const api = hrisApi;

  const form: DeleteDocumentSchema = {
    documents: prevState.form.documents,
    filter: prevState.form.filter,
    filterStatus: prevState.form.filterStatus,
    filterCategory: prevState.form.filterCategory,
  };

  try {
    if (!form.documents.length) {
      return {
        ...prevState,
        status: 'validation-error',
        errors: { documents: [DOCUMENTS_ERRORS.NONE_SELECTED] },
      };
    }

    const { documents, filter, filterCategory, filterStatus } = form;

    await api.documents.archiveDocuments(documents, filterCategory, filter, filterStatus);

    revalidatePath(HRIS_ROUTES.documents.base);

    return {
      ...prevState,
      data: undefined,
      status: 'success',
    };
  } catch (err) {
    logger.info(err);

    return {
      ...prevState,
      form: {
        ...prevState.form,
      },
      ...handleActionError(err),
    };
  }
}
