import {
  type Prettify,
  type CUID,
  type Nullable,
  type WithId,
  type Paginated,
  type WithAccess,
  type ActionType,
} from '@/shared';
import { type EquipmentStatus } from '@/api/hris/prisma/client';

// Re-export Prisma's EquipmentStatus as the single source of truth
export type { EquipmentStatus };

// EquipmentAssignStatus is application-level, not in database
export type EquipmentAssignStatus = 'ASSIGNED' | 'FREE';

export type EquipmentDto = WithId<{
  signature: string;
  name: string;
  brand: Nullable<string>;
  model: Nullable<string>;
  status: EquipmentStatus;
  locationId: Nullable<string>;
  note: Nullable<string>;
  serial: Nullable<string>;
  invoiceNumber: Nullable<string>;
  supplier: Nullable<string>;
  purchaseDate: Nullable<Date>;
  warrantyDuration: Nullable<number>;
  leaseDuration: Nullable<number>;
  value: Nullable<number>;
  assigneeId: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
  categoryId: Nullable<CUID>;
  description: Nullable<string>;
  category: Nullable<EquipmentCategoryDto>;
  avatarId: Nullable<CUID>;
  documentIds: CUID[];
  photoIds: CUID[];
}>;

export type EquipmentGeneralDataDto = EquipmentDto & {
  category: Nullable<EquipmentCategoryDto>;
  location: Nullable<EquipmentLocationDto>;
};

export type EquipmentGeneralDataWithAccessDto = WithAccess<
  EquipmentGeneralDataDto,
  { actions: EquipmentAction[] }
>;

export type CreateEquipmentDto = Prettify<
  Pick<EquipmentDto, 'signature' | 'name'> &
    Partial<Omit<EquipmentDto, 'signature' | 'name' | 'categoryId' | 'id' | 'locationId' | 'category'>>
> & {
  documents?: File[];
  avatar?: Nullable<File | string>;
};

export type UpdateEquipmentDto = Prettify<
  Partial<
    Omit<CreateEquipmentDto, 'documentsIds' | 'photoIds'> & {
      avatar: Nullable<File | string>;
    }
  >
>;

export type AssigneeDto = {
  id: CUID;
  fullName: string;
  avatarId: Nullable<CUID>;
};

export type EquipmentListItemDto = WithId<{
  name: string;
  signature: string;
  category: Nullable<string>;
  status: EquipmentStatus;
  assignee: Nullable<AssigneeDto>;
  brand: Nullable<string>;
  model: Nullable<string>;
}>;

export type EquipmentListDto = Paginated<EquipmentListItemDto>;

export type EquipmentAction = Extract<
  ActionType,
  'create' | 'assign' | 'archive' | 'filter' | 'select' | 'duplicate' | 'changeStatus' | 'edit'
>;

export type EquipmentListWithAccessDto = WithAccess<
  EquipmentListDto,
  {
    columns: (keyof EquipmentListItemDto)[];
    actions: EquipmentAction[];
  }
>;

export type EquipmentCategoryDto = WithId<{
  name: string;
}>;

export type EquipmentCategoryListDto = Paginated<EquipmentCategoryDto>;

export type EquipmentDocumentDto = WithId<{
  description: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  expDate: Nullable<Date>;
}>;

export type EquipmentPhotoDto = WithId<{
  filePath: string;
  equipmentId: CUID;
}>;

export type EquipmentLocationDto = {
  id: CUID;
  name: string;
};

export type EquipmentLocationListDto = Paginated<EquipmentLocationDto>;
