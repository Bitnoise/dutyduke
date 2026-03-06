import { type ActionReturnValidationErrorsType, type ActionReturnType, type CUID } from '@/shared';
import { type EmployeeOtherForm, type EmployeeOtherSchema } from './../_schemas/employee-other-form.schema';

type EmployeeOtherInfoValidationError<T> = Record<string, Partial<Record<keyof T, string[] | undefined>>>;

export type ChildrenError = EmployeeOtherInfoValidationError<EmployeeOtherSchema['children'][number]>;

type ActionValidationErrorState = ActionReturnValidationErrorsType<Omit<EmployeeOtherForm, 'children'>> & {
  children: ChildrenError;
  employeePhoto?: string;
};

export type EditEmployeeOtherInfoState = ActionReturnType<
  EmployeeOtherForm & { employeeId: CUID },
  undefined,
  ActionValidationErrorState
>;
