'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  ApiError,
  ERROR_MESSAGES,
  handleActionError,
  HRIS_ROUTES,
  type Nullable,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { EQUIPMENT_ERRORS } from '@/api/hris/resources/errors';
import { createEquipmentSchema, type CreateEquipmentForm } from '../_schemas';

export type CreateEmployeeState = ActionReturnType<
  CreateEquipmentForm,
  undefined,
  ActionReturnValidationErrorsType<CreateEquipmentForm>
>;

export async function createEquipment(
  prevState: CreateEmployeeState,
  formData: FormData,
): Promise<CreateEmployeeState> {
  const form: CreateEquipmentForm = {
    category: formData.get('category') as string,
    signature: formData.get('signature') as string,
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    status: formData.get('status') as string,
    value: formData.get('value') as string,
    location: formData.get('location') as string,
    description: formData.get('description') as string,
    serial: formData.get('serial') as string,
    avatar: (formData.get('photo') ?? undefined) as File | undefined,
    invoiceNumber: formData.get('invoiceNumber') as string,
    supplier: formData.get('supplier') as string,
    purchaseDate: formData.get('purchaseDate') as string,
    warrantyDuration: formData.get('warrantyDuration') as string,
    leaseDuration: formData.get('leaseDuration') as string,
  };

  const validationResult = createEquipmentSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    const category = await api.resources.getCategoryByName(validationResult.data.category);

    let categoryId = category?.id;
    if (!category) {
      categoryId = await api.resources.createCategory(validationResult.data.category);
    }

    let locationId: Nullable<string> = null;

    if (validationResult.data.location) {
      const location = await api.resources.getEquipmentLocationByName(validationResult.data.location);
      locationId = location?.id ?? null;

      if (!location) {
        locationId = await api.resources.createEquipmentLocation(validationResult.data.location);
      }
    }

    await api.resources.createEquipment(categoryId!, locationId, validationResult.data);
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

  revalidatePath(HRIS_ROUTES.equipment.base);

  redirect(HRIS_ROUTES.equipment.base);
}
