import { ApiError } from 'next/dist/server/api-utils';
import { type CUID } from '@/api/hris/types';
import { type Nullable } from '@/shared';
import { type BaseEmployeeDto } from '../dtos';
import { EMPLOYEE_ERROR_MESSAGES } from '../../errors';

type EmployeeQuery = {
  getEmployeeById: (id: CUID) => Promise<Nullable<BaseEmployeeDto>>;
};

export function validateEmployeeStatusUseCase(employeeQuery: EmployeeQuery) {
  return async (employeeId: CUID) => {
    const employee = await employeeQuery.getEmployeeById(employeeId);

    if (!employee) {
      throw new ApiError(404, EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
    }

    if (employee.status === 'ARCHIVED') {
      throw new ApiError(403, EMPLOYEE_ERROR_MESSAGES.ARCHIVED);
    }
  };
}
