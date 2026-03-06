import { type EmploymentType, type OrganizationPrisma } from '@/api/hris/prisma/client';
import {
  type WithoutId,
  type WithId,
  type CUID,
  type Nullable,
  type Paginated,
  type WithAccess,
  type ActionType,
} from '@/shared';
import { type EmployeeStatusDto } from './employee-status.dto';

export type EmployeeDto = WithId<{
  identityId: Nullable<CUID>;
  status: EmployeeStatusDto;

  firstName: string;
  lastName: string;
  personalId: Nullable<string>;
  birthdate: Nullable<Date>;
  avatarId: Nullable<string>;

  role: Nullable<string>;
  employmentType: Nullable<EmploymentType>;
  taxId: Nullable<string>;
  bankAccount: Nullable<string>;
  holiday: Nullable<number>;
  firstYearHoliday: Nullable<number>;
  joinDate: Nullable<Date>;

  workEmail: string;
  additionalEmails: string[];
  phone: Nullable<string>;
  address: Nullable<string>;
  iceName: Nullable<string>;
  icePhone: Nullable<string>;

  description: Nullable<string>;
  documentIds: string[];
  hobbies: string[];
  children: EmployeeChildDto[];
  photosIds: string[];

  createdAt: Date;
  updatedAt: Date;
}>;

export type BaseEmployeeDto = Pick<
  EmployeeDto,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'avatarId'
  | 'workEmail'
  | 'status'
  | 'identityId'
  | 'phone'
  | 'documentIds'
  | 'photosIds'
  | 'holiday'
  | 'firstYearHoliday'
  | 'joinDate'
>;

export type CreateEmployeeDto = Pick<EmployeeDto, 'firstName' | 'lastName' | 'workEmail' | 'status'> &
  Partial<Omit<EmployeeDto, 'children' | 'photosIds' | 'createdAt' | 'additionalEmails' | 'updatedAt'>>;

export type EmployeeGeneralInfoDto = Omit<EmployeeDto, 'createdAt' | 'updatedAt'>;

export type EmployeeGeneralInfoAccess = boolean | Partial<Record<keyof EmployeeGeneralInfoDto, true>>;

export type EmployeeGeneralInfoWithAccessDto = WithAccess<
  EmployeeGeneralInfoDto,
  { edit: EmployeeGeneralInfoAccess }
>;

export type UpdateEmployeeGeneralInfoDto = Omit<
  WithoutId<EmployeeGeneralInfoDto>,
  'children' | 'photos' | 'avatarId' | 'additionalEmails'
>;

export type EmployeeChildDto = WithId<{
  name: string;
  birthDate: Date;
}>;

export type EmployeeEarningsDto = WithId<{
  employeeId: CUID;
  value: number;
  date: Date;
  description: string;
}>;

export type EmployeeEarningsWithAccessDto = WithAccess<
  { earnings: EmployeeEarningsDto[] },
  { edit: boolean }
>;

export type UpdateEmployeeEarningsDto = Omit<WithoutId<EmployeeEarningsDto>, 'value'> & {
  value: OrganizationPrisma.Decimal;
};

export type EmployeeListItemDto = WithId<Omit<BaseEmployeeDto, 'avatarId'>>;
export type AssignEmployeeListItemDto = WithId<
  Pick<BaseEmployeeDto, 'lastName' | 'firstName' | 'role' | 'status'>
>;

export type EmployeeAction = Extract<
  ActionType,
  | 'create'
  | 'mail'
  | 'generate-cv'
  | 'assign'
  | 'archive'
  | 'filter'
  | 'select'
  | 'edit'
  | 'delete'
  | 'open'
  | 'addFile'
>;

export type EmployeeListDto = WithAccess<
  Paginated<EmployeeListItemDto>,
  { columns: (keyof EmployeeListItemDto)[]; actions: EmployeeAction[] }
>;

export type BaseEmployeeWithAccessDto = WithAccess<BaseEmployeeDto, { actions: EmployeeAction[] }>;
export type AssignEmployeeListDto = WithAccess<
  Paginated<AssignEmployeeListItemDto>,
  { columns: (keyof AssignEmployeeListItemDto)[] }
>;

export type AssignedEmployeeDto = WithId<Pick<BaseEmployeeDto, 'avatarId' | 'firstName' | 'lastName'>>;
