'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  projectSchema,
  type ProjectForm,
  type ProjectSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type Form = ProjectForm & { employeeId: CUID; projectId: CUID };

type UpdateProjectState = ActionReturnType<Form, undefined, ActionReturnValidationErrorsType<ProjectSchema>>;

export async function updateProject(
  prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  const form: Form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    description: formData.get('description') as string,
    isVisible: formData.get('isVisible') === 'true',
    employeeId: prevState.form.employeeId,
    projectId: prevState.form.projectId,
  };

  const validationResult = projectSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;

  try {
    await api.employees.updateProject(form.employeeId, form.projectId, validationResult.data);

    revalidatePath(HRIS_ROUTES.employees.skills.base(form.employeeId));
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }

  return {
    ...prevState,
    status: 'success',
    form,
    data: undefined,
  };
}
