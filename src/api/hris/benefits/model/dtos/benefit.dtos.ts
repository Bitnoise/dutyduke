import {
  type Prettify,
  type CUID,
  type Nullable,
  type WithId,
  type Paginated,
  type WithAccess,
  type ActionType,
} from '@/shared';

// Base Benefit DTO
export type BenefitDto = WithId<{
  name: string;
  note: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}>;

// Benefit List Item DTO (for list views)
export type BenefitListItemDto = WithId<{
  name: string;
  note: Nullable<string>;
  createdAt: Date;
  assignedEmployees: Array<{
    id: CUID;
    firstName: string;
    lastName: string;
    avatarId: Nullable<CUID>;
  }>;
}>;

// Create Benefit DTO
export type CreateBenefitDto = Prettify<
  Pick<BenefitDto, 'name'> & {
    note?: Nullable<string>;
  }
>;

// Update Benefit DTO
export type UpdateBenefitDto = Prettify<Partial<Pick<BenefitDto, 'name' | 'note'>>>;

// Employee Benefit DTO (with relations)
export type EmployeeBenefitDto = WithId<{
  benefitId: CUID;
  employeeId: CUID;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  benefit: BenefitDto;
  employee: {
    id: CUID;
    firstName: string;
    lastName: string;
    isActive: boolean;
    avatarId: Nullable<CUID>;
  };
}>;

// Employee Benefit List Item DTO
export type EmployeeBenefitListItemDto = WithId<{
  benefitId: CUID;
  employeeId: CUID;
  startDate: Date;
  benefit: {
    id: CUID;
    name: string;
  };
  employee: {
    id: CUID;
    firstName: string;
    lastName: string;
    isActive: boolean;
    avatarId: Nullable<CUID>;
  };
}>;

// List DTOs
export type BenefitListDto = Paginated<BenefitListItemDto>;
export type EmployeeBenefitListDto = Paginated<EmployeeBenefitListItemDto>;

// Actions
export type BenefitAction = Extract<
  ActionType,
  'create' | 'edit' | 'delete' | 'assign' | 'unassign' | 'select'
>;

// With Access DTOs
export type BenefitListWithAccessDto = WithAccess<
  BenefitListDto,
  {
    columns: (keyof BenefitListItemDto)[];
    actions: BenefitAction[];
  }
>;

export type EmployeeBenefitListWithAccessDto = WithAccess<
  EmployeeBenefitListDto,
  {
    columns: (keyof EmployeeBenefitListItemDto)[];
    actions: BenefitAction[];
  }
>;
