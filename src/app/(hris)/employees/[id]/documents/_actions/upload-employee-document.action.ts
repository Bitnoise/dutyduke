'use server';

import { revalidatePath } from 'next/cache';
import {
  ERROR_MESSAGES,
  HRIS_ROUTES,
  MAX_FILE_SIZE,
  handleActionError,
  type UploadEmployeeDocumentState,
} from '@/shared';
import { hrisApi } from '@/api/hris';

export async function uploadEmployeeDocument(
  state: UploadEmployeeDocumentState,
  formData: FormData,
): Promise<UploadEmployeeDocumentState> {
  const documents = formData.getAll('document') as File[];

  const api = hrisApi;

  for (const document of documents) {
    if (!document || !document?.size) continue;

    if (document.size > MAX_FILE_SIZE)
      return {
        ...state,
        status: 'validation-error',
        errors: { file: [ERROR_MESSAGES.INVALID_DOCUMENT_SIZE] },
      };

    try {
      await api.employees.uploadEmployeeDocument(state.form.employeeId, document);
    } catch (err) {
      return { ...state, ...handleActionError(err) };
    }
  }

  revalidatePath(HRIS_ROUTES.employees.documents.base(state.form.employeeId));

  return {
    ...state,
    data: undefined,
    status: 'success',
  };
}
