'use server';

import { revalidatePath } from 'next/cache';
import {
  ERROR_MESSAGES,
  HRIS_ROUTES,
  MAX_FILE_SIZE,
  type UploadEquipmentDocumentState,
  handleActionError,
} from '@/shared';
import { hrisApi } from '@/api/hris';

export async function uploadEquipmentDocument(
  state: UploadEquipmentDocumentState,
  formData: FormData,
): Promise<UploadEquipmentDocumentState> {
  const documents = formData.getAll('document') as File[];
  const api = hrisApi;

  if (!state.form.equipmentId) {
    return {
      ...state,
      status: 'validation-error',
      errors: { equipmentId: [ERROR_MESSAGES.INVALID_ID] },
    };
  }

  for (const document of documents) {
    if (!document || !document?.size) continue;

    if (document.size > MAX_FILE_SIZE)
      return {
        ...state,
        status: 'validation-error',
        errors: { file: [ERROR_MESSAGES.INVALID_DOCUMENT_SIZE] },
      };

    try {
      await api.resources.uploadEquipmentDocument(state.form.equipmentId, document);
    } catch (err) {
      return { ...state, ...handleActionError(err) };
    }
  }

  revalidatePath(HRIS_ROUTES.equipment.documents.base(state.form.equipmentId));

  return {
    ...state,
    data: undefined,
    status: 'success',
  };
}
