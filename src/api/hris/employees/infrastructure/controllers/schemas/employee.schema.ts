import {
  type EmployeeGeneralInfoDto,
  type EmployeeChildDto,
  type UpdateEmployeeGeneralInfoDto,
} from '@/api/hris/employees/model/dtos';

export type EmployeeGeneralInfoSchema = EmployeeGeneralInfoDto;

export type UpdateEmployeeGeneralInfoSchema = Partial<
  UpdateEmployeeGeneralInfoDto & {
    children: EmployeeChildDto[];
    additionalEmails: string[];
  }
>;
