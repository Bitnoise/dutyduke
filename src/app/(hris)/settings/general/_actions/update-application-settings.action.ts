'use server';

import { revalidatePath } from 'next/cache';
import {
  applicationSettingsSchema,
  type ApplicationSettingsForm,
  type ApplicationSettingsSchema,
} from '@/app/(hris)/settings/general/_schemas';
import {
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { type Language, type DateFormat } from '@/api/hris/prisma/client';
import { clearUserLocaleCache } from '@/shared/service/locale/user-locale.service';

type UpdateApplicationSettingsState = ActionReturnType<
  ApplicationSettingsForm,
  undefined,
  ActionReturnValidationErrorsType<ApplicationSettingsSchema>
>;

export async function updateApplicationSettings(
  prevState: UpdateApplicationSettingsState,
  formData: FormData,
): Promise<UpdateApplicationSettingsState> {
  const form: ApplicationSettingsForm = {
    language: formData.get('language') as string,
    dateFormat: formData.get('dateFormat') as string,
  };

  const validationResult = applicationSettingsSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;
  try {
    await api.settings.upsertSettings({
      language: validationResult.data.language as Language,
      dateFormat: validationResult.data.dateFormat as DateFormat,
    });
    clearUserLocaleCache();
  } catch (err) {
    return { ...prevState, form, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.settings.general);

  return {
    status: 'success',
    data: undefined,
    form,
  };
}
