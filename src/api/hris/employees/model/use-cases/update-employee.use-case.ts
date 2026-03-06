import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type UpdateEmployeeGeneralInfoSchema } from '@/api/hris/employees/infrastructure/controllers/schemas';
import { type EmployeeRepository } from '@/api/hris/employees/model/repositories';

import { ApiError, type CUID } from '@/shared';
import { type EmployeeGeneralInfoAccess } from '../dtos';

export function updateEmployeeUseCase(repository: EmployeeRepository) {
  return async (
    employeeId: CUID,
    employee: UpdateEmployeeGeneralInfoSchema,
    access: EmployeeGeneralInfoAccess,
  ) => {
    const { children, additionalEmails, ...restEmployee } = employee;

    const employeeToUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(restEmployee)) {
      const canEditField = typeof access === 'object' ? Object.keys(access).includes(key) : access;

      // Skip if field cannot be edited
      if (!canEditField) {
        continue;
      }

      // Skip if value is undefined (not provided)
      if (value === undefined) {
        continue;
      }

      // Allow null values for nullable fields (e.g., identityId)
      // Only skip null if it's not explicitly set (but we already checked for undefined above)
      employeeToUpdate[key] = value;
    }

    await repository.updateEmployee(employeeId, employeeToUpdate);

    if (typeof children !== 'undefined') {
      await repository.updateChildren(
        employeeId,
        children.map((child) => ({
          name: child.name,
          birthDate: child.birthDate,
        })),
      );
    }

    if (typeof additionalEmails !== 'undefined') {
      try {
        await repository.updateAdditionalEmails(employeeId, additionalEmails);
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
          throw new ApiError(409, EMPLOYEE_ERROR_MESSAGES.ADDITIONAL_EMAIL_ALREADY_EXISTS);
        }
      }
    }
  };
}
