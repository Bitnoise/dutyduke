'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { handleActionError, HRIS_ROUTES } from '@/shared';
import { DOCUMENTS_ERRORS } from '@/api/hris/documents/errors';
import { logger } from '@/shared/service/pino';
import { type EditDocumentSchema } from '../_schemas';
import { type EditDocumentState } from './types';

export async function editDocuments(
  prevState: EditDocumentState,
  formData: FormData,
): Promise<EditDocumentState> {
  const api = hrisApi;

  const form: EditDocumentSchema = {
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    expirationDate: formData.get('expirationDate') as string,
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

    const { description, expirationDate, documents, filter, filterCategory, filterStatus, category } = form;

    await api.documents.updateDocuments(
      documents,
      {
        description,
        expDate: expirationDate,
        categoryId: category,
      },
      filterCategory,
      filter,
      filterStatus,
    );

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
