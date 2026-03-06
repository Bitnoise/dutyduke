'use server';

import { revalidatePath } from 'next/cache';
import { type CompanySchema, companySchema, type CompanyForm } from '@/app/(hris)/company/general/_schemas';
import {
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
} from '@/shared';
import { hrisApi } from '@/api/hris';

type UpdateCompanyActionState = ActionReturnType<
  CompanyForm,
  undefined,
  ActionReturnValidationErrorsType<CompanySchema>
>;

export async function updateCompany(
  prevState: UpdateCompanyActionState,
  formData: FormData,
): Promise<UpdateCompanyActionState> {
  const form: CompanyForm = {
    name: formData.get('name') as string,
    logo: (formData.get('logo') || null) as File | null,
    logoId: formData.get('logoId') as string | null,
  };

  const validationResult = companySchema.safeParse(form);

  if (!validationResult.success) {
    return {
      form: {
        ...form,
        logo: JSON.stringify(form.logo),
      },
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;
    await api.company.upsertCompany(validationResult.data);
  } catch (err) {
    return { ...prevState, form, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.settings.general);

  return {
    form: {
      ...form,
      logo: JSON.stringify(form.logo),
    },
    status: 'success',
    data: undefined,
  };
}
