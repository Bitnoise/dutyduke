'use server';
import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type LanguageErrors } from '@/app/(hris)/employees/[id]/skills/_actions/types';
import { languageSchema, type LanguageSchema } from '@/app/(hris)/employees/[id]/skills/_schemas';
import { handleActionError, HRIS_ROUTES, type Nullable, type ActionReturnType, type CUID } from '@/shared';

type Form = {
  description: string;
  languages: LanguageSchema[];
  primarySkills: string;
  secondarySkills: string;
  employeeId: CUID;
};

type UpdateBasicInfoState = ActionReturnType<
  Form,
  undefined,
  {
    languages: LanguageErrors;
  }
>;

export async function updateBasicInfo(
  prevState: UpdateBasicInfoState,
  formData: FormData,
): Promise<UpdateBasicInfoState> {
  // Languages
  const languageIds = formData.getAll('language-id');
  const languageNames = formData.getAll('language-name');
  const languageLevel = formData.getAll('language-level');

  const languages = [];
  const languageErrors: LanguageErrors = {};

  for (let i = 0; i < languageIds.length; i++) {
    const id = languageIds[i] as string;
    const name = languageNames[i] as string;
    const level = languageLevel[i] as string;

    const validationResult = languageSchema.safeParse({ id, name, level });

    if (validationResult.success) {
      languages.push(validationResult.data);
    } else {
      languageErrors[id] = validationResult.error.flatten().fieldErrors;
    }
  }

  // Primary & Secondary skills
  const primarySkills = formData.get('primarySkills') as string;
  const secondarySkills = (formData.get('secondarySkills') ?? '') as string;

  // validate whole form
  const validate = (errors: object) => Object.values(errors).some(Boolean);

  const isFormInvalid = validate(languageErrors);

  if (isFormInvalid) {
    return {
      ...prevState,
      status: 'validation-error',
      errors: {
        languages: languageErrors,
      },
    };
  }

  try {
    const api = hrisApi;

    await api.employees.updateEmployeeSkills(prevState.form.employeeId, {
      description: formData.get('description') as Nullable<string>,
      languages,
      primarySkills: primarySkills
        .split(',')
        .filter(Boolean)
        .map((skill) => skill.trim()),
      secondarySkills: secondarySkills
        .split(',')
        .filter(Boolean)
        .map((skill) => skill.trim()),
    });
  } catch (err) {
    return { ...prevState, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.employees.skills.base(prevState.form.employeeId));

  return {
    ...prevState,
    data: undefined,
    status: 'success',
  };
}
