'use server';

import { revalidatePath } from 'next/cache';
import {
  type ActionReturnValidationErrorsType,
  type ActionReturnType,
  handleActionError,
  HRIS_ROUTES,
  ApiError,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { addCategorySchema, type AddCategorySchema } from '../_schema/add-category.schema';

type State = ActionReturnType<
  AddCategorySchema,
  undefined,
  ActionReturnValidationErrorsType<AddCategorySchema>
>;

export async function addCategory(state: State, formData: FormData): Promise<State> {
  const form = Object.fromEntries(formData.entries()) as AddCategorySchema;

  const validationResult = addCategorySchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;

  try {
    await api.documents.createDocumentCategory(validationResult.data.name);
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        ...state,
        status: 'validation-error',
        errors: {
          name: ['errorMessages.categoryAlreadyExists'],
        },
      };
    }

    return {
      form,
      ...handleActionError(err),
    };
  }

  revalidatePath(HRIS_ROUTES.documents.categories);

  return {
    status: 'success',
    data: undefined,
    form,
  };
}
