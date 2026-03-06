'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import {
  updateEquipmentBasicInfoSchema,
  type EquipmentBasicInfoForm,
  type EquipmentBasicInfoSchema,
} from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  ApiError,
  ERROR_MESSAGES,
  handleActionError,
  HRIS_ROUTES,
  type Nullable,
} from '@/shared';

type UpdateEquipmentBasicInfoState = ActionReturnType<
  EquipmentBasicInfoForm & { equipmentId: CUID },
  undefined,
  ActionReturnValidationErrorsType<EquipmentBasicInfoSchema>
>;

export async function updateEquipmentBasicInfo(
  prevState: UpdateEquipmentBasicInfoState,
  formData: FormData,
): Promise<UpdateEquipmentBasicInfoState> {
  const form: EquipmentBasicInfoForm = {
    category: formData.get('category') as string,
    signature: formData.get('signature') as string,
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    status: formData.get('status') as string,
    location: formData.get('location') as string,
    description: formData.get('description') as string,
    serial: formData.get('serial') as string,
    avatar: (formData.get('photo') ?? null) as Nullable<string | File>,
    avatarId: (formData.get('avatarId') ?? null) as Nullable<string>,
  };

  const validationResult = updateEquipmentBasicInfoSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    const { category: categoryName, location: locationName, ...equipmentToUpdate } = validationResult.data;
    const category = categoryName ? await api.resources.getCategoryByName(categoryName) : null;

    let categoryId = category?.id;
    if (!category) {
      categoryId = categoryName ? await api.resources.createCategory(categoryName) : undefined;
    }

    let locationId: Nullable<string> = null;

    if (locationName) {
      const location = await api.resources.getEquipmentLocationByName(locationName);
      locationId = location?.id ?? null;

      if (!location) {
        locationId = await api.resources.createEquipmentLocation(locationName);
      }
    }

    await api.resources.updateEquipment(
      prevState.form.equipmentId,
      equipmentToUpdate,
      categoryId,
      locationId,
    );

    revalidatePath(HRIS_ROUTES.equipment.general(prevState.form.equipmentId));

    return {
      ...prevState,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      if (err.message === EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SIGNATURE(validationResult.data.signature)) {
        return {
          ...prevState,
          status: 'validation-error',
          errors: {
            signature: [ERROR_MESSAGES.EQUIPMENT.ALREADY_EXISTS_BY_SIGNATURE],
          },
        };
      }

      if (
        validationResult.data.serial &&
        err.message === EQUIPMENT_ERRORS.ALREADY_EXISTS_BY_SERIAL(validationResult.data.serial)
      ) {
        return {
          ...prevState,
          status: 'validation-error',
          errors: {
            serial: [ERROR_MESSAGES.EQUIPMENT.ALREADY_EXISTS_BY_SERIAL],
          },
        };
      }
    }

    return { ...prevState, ...handleActionError(err) };
  }
}
