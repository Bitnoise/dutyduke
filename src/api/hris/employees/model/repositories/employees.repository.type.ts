import {
  type CreateEmployeeDto,
  type UpdateEmployeeGeneralInfoDto,
  type EmployeeChildDto,
  type EmployeeStatusDto,
} from '@/api/hris/employees/model/dtos';
import { type WithoutId, type CUID } from '@/shared';

export type EmployeeRepository = {
  createEmployee: (employee: CreateEmployeeDto) => Promise<CUID>;
  updateEmployee(employeeId: CUID, employee: Partial<UpdateEmployeeGeneralInfoDto>): Promise<void>;
  updateChildren(employeeId: CUID, children: WithoutId<EmployeeChildDto>[]): Promise<void>;
  updateStatus: (employeeId: CUID, status: EmployeeStatusDto) => Promise<void>;
  updateAdditionalEmails(employeeId: CUID, emails: string[]): Promise<void>;
  deleteAllEmployees: () => Promise<void>;
};
