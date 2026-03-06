'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { ApiError, ERROR_MESSAGES, handleActionError, HRIS_ROUTES } from '@/shared';
import {
  createDictionaryEntityProvider,
  type DictionaryArea,
  type DictionaryName,
} from '@/shared/service/dictionaries/dictionaries.service';
import {
  createDictionaryEntitySchema,
  type CreateDictionaryEntitySchema,
} from '@/shared/schemas/creaate-dictionary-entity.schema';
import { type CreateDictionaryEntityActionState } from '@/shared/types/dictionary';

export async function createDictionaryEntity(
  prevState: CreateDictionaryEntityActionState,
  formData: FormData,
  dictionaryName: string,
): Promise<CreateDictionaryEntityActionState> {
  const name = formData.get('name') as string;

  const form: CreateDictionaryEntitySchema = {
    name: formData.get('name') as string,
  };

  const validationResult = createDictionaryEntitySchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      status: 'validation-error',
      form,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const api = hrisApi;
  try {
    await createDictionaryEntityProvider(
      api,
      'employees',
      dictionaryName as DictionaryName<DictionaryArea>,
      name,
    );
    revalidatePath(HRIS_ROUTES.employees.dictionaries.base(dictionaryName));
    return {
      ...prevState,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        status: 'validation-error',
        form,
        errors: {
          name: [ERROR_MESSAGES.DICTIONARY.ALREADY_EXISTS(dictionaryName)],
        },
      };
    }

    return {
      ...prevState,
      ...handleActionError(err),
    };
  }
}
