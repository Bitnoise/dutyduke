'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID, handleActionError, HRIS_ROUTES, type Nullable } from '@/shared';
import { DOCUMENTS_ERRORS } from '@/api/hris/documents/errors';
import { logger } from '@/shared/service/pino';
import { type AddDocumentSchema } from '../_schemas/add-document.schema';
import { type AddDocumentState } from './types';

export async function addDocument(
  prevState: AddDocumentState,
  formData: FormData,
): Promise<AddDocumentState> {
  const api = hrisApi;

  const form: AddDocumentSchema = {
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    expirationDate: formData.get('expirationDate') as string,
    documents: formData.getAll('documents') as File[],
  };

  try {
    if (!form.documents.length) {
      return {
        ...prevState,
        status: 'validation-error',
        errors: { documents: [DOCUMENTS_ERRORS.NOT_ATTACHED] },
      };
    }

    const { description, expirationDate, documents } = form;
    const categoryValue = form.category?.trim() || null;
    const expirationDateValue = expirationDate ? new Date(expirationDate) : null;

    // For multiple files, use empty description; for single file, use description or fallback to filename
    const getFileDescription = (index: number) => {
      if (documents.length > 1) return '';
      const trimmedDescription = description?.trim();
      return trimmedDescription || documents[index]?.name || '';
    };

    let categoryId: Nullable<CUID> = null;
    if (categoryValue) {
      // Check if the value is a CUID (existing category ID from dropdown)
      // CUID format: starts with 'c' followed by 18-25 alphanumeric characters
      const isCUID = /^c[a-z0-9]{18,25}$/.test(categoryValue);

      if (isCUID) {
        // It's an existing category ID from the dropdown
        categoryId = categoryValue;
      } else {
        // It's a new category name - try to find existing category by name first
        try {
          // Search for category by exact name
          const searchResults = await api.documents.getAllCategories(categoryValue, undefined, 'all');
          const existingCategory = searchResults.items.find(
            (cat) => cat.name.toLowerCase() === categoryValue.toLowerCase(),
          );

          if (existingCategory) {
            // Category already exists, use its ID
            categoryId = existingCategory.id;
          } else {
            // Category doesn't exist, create it
            categoryId = await api.documents.createDocumentCategory(categoryValue);
          }
        } catch (err) {
          return {
            ...prevState,
            ...handleActionError(err),
          };
        }
      }
    }

    const docIds = await api.documents.uploadDocuments(documents, 'documents');

    await Promise.all(
      docIds.map((id, index) =>
        api.documents.updateDocument(id, {
          description: getFileDescription(index),
          expDate: expirationDateValue,
          categoryId,
        }),
      ),
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
