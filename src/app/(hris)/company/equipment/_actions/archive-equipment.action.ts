'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';
import { archiveEquipmentSchema, type ArchiveEquipmentSchema } from '../_schemas';

type ArchiveEquipmentActionState = ActionReturnType<
  ArchiveEquipmentSchema,
  undefined,
  ActionReturnValidationErrorsType<ArchiveEquipmentSchema>
>;

export async function archiveEquipment(
  prevState: ArchiveEquipmentActionState,
  formData: FormData,
): Promise<ArchiveEquipmentActionState> {
  const form: ArchiveEquipmentSchema = {
    equipmentIds: prevState.form.equipmentIds,
    description: formData.get('description') as string,
    filter: prevState.form.filter,
    filterStatus: prevState.form.filterStatus,
    filterCategory: prevState.form.filterCategory,
  };

  const validationResult = archiveEquipmentSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    if (validationResult.data.equipmentIds === 'all') {
      const allEquipments = await api.resources.getAllEquipments(
        validationResult.data.filterCategory ?? undefined,
        validationResult.data.filterStatus ?? undefined,
        validationResult.data.filter ?? undefined,
      );

      const allIds = allEquipments.map((eq) => eq.id);

      await Promise.all(
        allIds.map((id) =>
          api.resources.updateEquipmentStatus(id, 'ARCHIVED', validationResult.data.description ?? ''),
        ),
      );

      revalidatePath(HRIS_ROUTES.equipment.base);

      return {
        ...prevState,
        status: 'success',
        data: undefined,
      };
    }

    await Promise.all(
      validationResult.data.equipmentIds.map((id) =>
        api.resources.updateEquipmentStatus(id, 'ARCHIVED', validationResult.data.description ?? ''),
      ),
    );

    revalidatePath(HRIS_ROUTES.equipment.base);

    return {
      ...prevState,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }
}
