'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type CUID,
  type ActionReturnType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnValidationErrorsType,
} from '@/shared';
import { logger } from '@/shared/service/pino';
import { editEquipmentDocumentSchema, type EditEquipmentDocumentForm } from '../_schemas';

type EditEquipmentDocumentActionState = ActionReturnType<
  EditEquipmentDocumentForm & { equipmentId: CUID; documentId: CUID },
  { documentId: CUID },
  ActionReturnValidationErrorsType<EditEquipmentDocumentForm>
>;

export async function editEquipmentDocument(
  prevState: EditEquipmentDocumentActionState,
  formData: FormData,
): Promise<EditEquipmentDocumentActionState> {
  const form: EditEquipmentDocumentForm = {
    description: formData.get('description') as string,
    expDate: formData.get('expDate') as string,
  };

  const validationResult = editEquipmentDocumentSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    await api.resources.updateEquipmentDocument(
      prevState.form.equipmentId,
      prevState.form.documentId,
      validationResult.data,
    );

    revalidatePath(HRIS_ROUTES.equipment.documents.base(prevState.form.equipmentId));

    return {
      ...prevState,
      status: 'success',
      data: {
        documentId: prevState.form.documentId,
      },
      form: {
        ...prevState.form,
        ...form,
      },
    };
  } catch (err) {
    logger.info(err);

    return { ...prevState, ...handleActionError(err) };
  }
}
