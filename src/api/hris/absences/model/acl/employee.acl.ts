import { type BaseEmployeeDto, type BaseEmployeeWithAccessDto } from '@/api/hris/employees/model/dtos';
import { type CUID } from '@/shared';

export type EmployeesAcl = {
  getEmployeeById: (id: CUID) => Promise<BaseEmployeeWithAccessDto>;
  getEmployeeIdsBySkillIds: (skillIds: CUID[]) => Promise<CUID[]>;
  getAllEmployeesIds: () => Promise<CUID[]>;
  getEmployeesById: (ids: CUID[]) => Promise<BaseEmployeeDto[]>;
  getAllEmployees: () => Promise<BaseEmployeeDto[]>;
};
