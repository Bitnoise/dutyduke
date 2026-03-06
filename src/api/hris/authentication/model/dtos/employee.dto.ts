import { type EmploymentType } from '@/api/hris/prisma/client';
import { type CUID } from '@/api/hris/types';
import { type Nullable } from '@/shared';
import { type EmployeeStatusDto } from '@/api/hris/employees/model/dtos';

export type CreateEmployeeDto = {
  identityId?: Nullable<CUID>;
  status: EmployeeStatusDto;

  firstName: string;
  lastName: string;
  personalId?: Nullable<string>;
  birthdate?: Nullable<Date>;

  role?: Nullable<string>;
  employmentType?: Nullable<EmploymentType>;
  taxId?: Nullable<string>;
  bankAccount?: Nullable<string>;
  holiday?: Nullable<number>;
  firstYearHoliday?: Nullable<number>;
  joinDate?: Date;

  email: string;
  additionalEmails?: string[];
  phone?: Nullable<string>;
  address?: Nullable<string>;
  iceName?: Nullable<string>;
  icePhone?: Nullable<string>;

  hobbies?: string[];
};

export type EmployeeDto = {
  id: CUID;
  firstName: string;
  lastName: string;
  email: string;
  avatarId: CUID | null;
  status: EmployeeStatusDto;
};

export type MeDto = EmployeeDto & {
  roles: string[];
  locale: string;
  dateFormat: string;
};
