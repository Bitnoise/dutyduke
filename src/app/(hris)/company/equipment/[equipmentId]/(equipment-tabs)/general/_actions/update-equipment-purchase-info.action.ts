'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type EquipmentPurchaseInfoForm,
  equipmentPurchaseInfoSchema,
  type EquipmentPurchaseInfoSchema,
} from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type UpdateEquipmentPurchaseInfoState = ActionReturnType<
  EquipmentPurchaseInfoForm & { equipmentId: CUID },
  undefined,
  ActionReturnValidationErrorsType<EquipmentPurchaseInfoSchema>
>;

export async function updateEquipmentPurchaseInfo(
  prevState: UpdateEquipmentPurchaseInfoState,
  formData: FormData,
): Promise<UpdateEquipmentPurchaseInfoState> {
  const form: EquipmentPurchaseInfoForm = {
    invoiceNumber: formData.get('invoiceNumber') as string,
    supplier: formData.get('supplier') as string,
    value: formData.get('value') as string,
    purchaseDate: formData.get('purchaseDate') as string,
    warrantyDuration: formData.get('warrantyDuration') as string,
    leaseDuration: formData.get('leaseDuration') as string,
  };

  const validationResult = equipmentPurchaseInfoSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    await api.resources.updateEquipment(prevState.form.equipmentId, validationResult.data);

    revalidatePath(HRIS_ROUTES.equipment.general(prevState.form.equipmentId));

    return {
      ...prevState,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    return { ...prevState, ...handleActionError(err) };
  }
}
