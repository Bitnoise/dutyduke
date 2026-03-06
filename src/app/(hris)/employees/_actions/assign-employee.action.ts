'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';
import { assignEmployeeSchema, type AssignEmployeeSchema } from '../_schemas';

type AssignEmployeeActionState = ActionReturnType<
  AssignEmployeeSchema,
  undefined,
  ActionReturnValidationErrorsType<AssignEmployeeSchema>
>;

export async function assignEmployee(
  prevState: AssignEmployeeActionState,
): Promise<AssignEmployeeActionState> {
  const form: AssignEmployeeSchema = {
    equipmentIds: prevState.form.equipmentIds,
    assigneeId: prevState.form.assigneeId,
    filterCategory: prevState.form.filterCategory,
    filter: prevState.form.filter,
    filterStatus: prevState.form.filterStatus,
  };

  const validationResult = assignEmployeeSchema.safeParse(form);

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
        allIds.map((eqId) => api.employees.assignEquipment(eqId, validationResult.data.assigneeId)),
      );

      revalidatePath(HRIS_ROUTES.employees.equipment.base(validationResult.data.assigneeId));

      return {
        ...prevState,
        status: 'success',
        data: undefined,
      };
    }

    await Promise.all(
      validationResult.data.equipmentIds.map((eqId) =>
        api.employees.assignEquipment(eqId, validationResult.data.assigneeId),
      ),
    );

    revalidatePath(HRIS_ROUTES.employees.equipment.base(validationResult.data.assigneeId));

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
