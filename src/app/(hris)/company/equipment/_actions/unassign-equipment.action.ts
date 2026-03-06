'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  unassignEquipmentSchema,
  type UnassignEquipmentSchema,
} from '@/app/(hris)/company/equipment/_schemas';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';

type UnassignEquipmentActionState = ActionReturnType<
  UnassignEquipmentSchema,
  undefined,
  ActionReturnValidationErrorsType<UnassignEquipmentSchema>
>;

export async function unassignEquipment(
  prevState: UnassignEquipmentActionState,
): Promise<UnassignEquipmentActionState> {
  const form: UnassignEquipmentSchema = {
    equipmentIds: prevState.form.equipmentIds,
    filterCategory: prevState.form.filterCategory,
    filter: prevState.form.filter,
    filterStatus: prevState.form.filterStatus,
  };

  const validationResult = unassignEquipmentSchema.safeParse(form);
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

      await Promise.all(allIds.map((eqId) => api.resources.unassignEquipment(eqId)));

      revalidatePath(HRIS_ROUTES.equipment.base);

      return {
        ...prevState,
        status: 'success',
        data: undefined,
      };
    }

    await Promise.all(
      validationResult.data.equipmentIds.map((equipmentId) => api.resources.unassignEquipment(equipmentId)),
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
