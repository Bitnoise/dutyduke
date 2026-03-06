'use server';

import { revalidatePath } from 'next/cache';
import {
  type ActionReturnValidationErrorsType,
  handleActionError,
  type ActionReturnType,
  ApiError,
  ERROR_MESSAGES,
  HRIS_ROUTES,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { type CreateEmployeeDto } from '@/api/hris/employees/model/dtos';
import { employeeCreationSchema, type EmployeeCreationForm } from '../_schemas';

export type CreateEmployeeState = ActionReturnType<
  EmployeeCreationForm,
  undefined,
  ActionReturnValidationErrorsType<EmployeeCreationForm>
>;

export async function createEmployee(
  prevState: CreateEmployeeState,
  formData: FormData,
): Promise<CreateEmployeeState> {
  const form: EmployeeCreationForm = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    workEmail: formData.get('workEmail') as string,
    joinDate: formData.get('startingDate') as string,
    role: formData.get('role') as string,
    employmentType: formData.get('employmentType') as string,
    taxId: formData.get('taxId') as string,
    bankAccount: formData.get('bankAccount') as string,
    holiday: formData.get('holiday') as string,
    firstYearHoliday: formData.get('firstYearHoliday') as string,
  };

  const { data, success, error } = employeeCreationSchema.safeParse(form);

  if (!success) {
    return {
      ...prevState,
      form,
      status: 'validation-error',
      errors: error.flatten().fieldErrors,
    };
  }

  const employeeToCreate: Omit<CreateEmployeeDto, 'status'> = {
    ...data,
  };

  const api = hrisApi;

  // TODO: Implement user limit check for single organization
  // Previously used admin API to check organization.usersLimit
  // const employeesCount = await api.employees.getEmployeesCount();
  // if (organization.usersLimit <= employeesCount) { ... }

  try {
    // Default status is ACTIVE
    await api.employees.createEmployee({ ...employeeToCreate, status: 'ACTIVE' });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        status: 'validation-error',
        form,
        errors: {
          workEmail: [ERROR_MESSAGES.EMAIL_ALREADY_TAKEN],
        },
      };
    }

    return { ...prevState, ...handleActionError(err) };
  }

  revalidatePath(HRIS_ROUTES.employees.base);

  return {
    ...prevState,
    form,
    status: 'success',
    data: undefined,
  };
}
