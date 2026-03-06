'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type CourseForm,
  courseSchema,
  type EducationSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import {
  type CUID,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';

type Form = CourseForm & { courseId: CUID; employeeId: CUID };

type AddCourseActionState = ActionReturnType<
  Form,
  undefined,
  ActionReturnValidationErrorsType<EducationSchema>
>;

export async function addCourse(
  prevState: AddCourseActionState,
  formData: FormData,
): Promise<AddCourseActionState> {
  const form: Form = {
    date: formData.get('date') as string,
    name: formData.get('name') as string,
    employeeId: prevState.form.employeeId,
    courseId: prevState.form.courseId,
  };

  const validationResult = courseSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
      form,
    };
  }

  const api = hrisApi;

  try {
    await api.employees.addCourse(form.employeeId, validationResult.data);

    revalidatePath(HRIS_ROUTES.employees.skills.base(form.employeeId));

    return {
      ...prevState,
      status: 'success',
      form,
      data: undefined,
    };
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }
}
