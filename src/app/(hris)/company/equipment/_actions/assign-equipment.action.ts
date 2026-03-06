'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { assignEquipmentSchema, type AssignEquipmentSchema } from '@/app/(hris)/company/equipment/_schemas';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';

type AssignEquipmentActionState = ActionReturnType<
  AssignEquipmentSchema,
  undefined,
  ActionReturnValidationErrorsType<AssignEquipmentSchema>
>;

export async function assignEquipment(
  prevState: AssignEquipmentActionState,
): Promise<AssignEquipmentActionState> {
  const form: AssignEquipmentSchema = {
    equipmentIds: prevState.form.equipmentIds,
    assigneeId: prevState.form.assigneeId,
    filterCategory: prevState.form.filterCategory,
    filter: prevState.form.filter,
    filterStatus: prevState.form.filterStatus,
  };

  const validationResult = assignEquipmentSchema.safeParse(form);
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
        allIds.map((eqId) => api.resources.assignEquipment(eqId, validationResult.data.assigneeId)),
      );

      revalidatePath(HRIS_ROUTES.equipment.base);

      return {
        ...prevState,
        status: 'success',
        data: undefined,
      };
    }

    await Promise.all(
      validationResult.data.equipmentIds.map((equipmentId) =>
        api.resources.assignEquipment(equipmentId, validationResult.data.assigneeId),
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
