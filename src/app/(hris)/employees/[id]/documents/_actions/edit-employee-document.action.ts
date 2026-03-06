'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  editEmployeeDocumentSchema,
  type EditEmployeeDocumentForm,
} from '@/app/(hris)/employees/[id]/documents/_schemas';
import {
  type CUID,
  type ActionReturnType,
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnValidationErrorsType,
} from '@/shared';
import { logger } from '@/shared/service/pino';

type EditEmployeeDocumentActionState = ActionReturnType<
  EditEmployeeDocumentForm & { employeeId: CUID; documentId: CUID },
  { documentId: CUID },
  ActionReturnValidationErrorsType<EditEmployeeDocumentForm>
>;

export async function editEmployeeDocument(
  prevState: EditEmployeeDocumentActionState,
  formData: FormData,
): Promise<EditEmployeeDocumentActionState> {
  const form: EditEmployeeDocumentForm = {
    description: formData.get('description') as string,
    expDate: formData.get('expDate') as string,
  };

  const validationResult = editEmployeeDocumentSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const api = hrisApi;

    await api.employees.updateEmployeeDocument(
      prevState.form.employeeId,
      prevState.form.documentId,
      validationResult.data,
    );

    revalidatePath(HRIS_ROUTES.employees.documents.base(prevState.form.employeeId));

    return {
      ...prevState,
      status: 'success',
      data: {
        documentId: prevState.form.documentId,
      },
      form: {
        ...prevState.form,
        ...form,
      },
    };
  } catch (err) {
    logger.info(err);

    return { ...prevState, ...handleActionError(err) };
  }
}
