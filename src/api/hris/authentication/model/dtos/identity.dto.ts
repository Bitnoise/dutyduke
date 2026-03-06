import { type CreateEmployeeDto } from '@/api/hris/authentication/model/dtos/employee.dto';

export type IdentityDto = {
  email: string;
  password: string;
};

export type NewIdentityDto = {
  email: string;
  password: string;
  employee: Omit<CreateEmployeeDto, 'email'>;
};

export type CreateIdentityDto = {
  email: string;
};
