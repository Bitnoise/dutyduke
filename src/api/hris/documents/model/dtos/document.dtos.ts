import { type DocumentStatus } from '@/api/hris/prisma/client';
import {
  type ActionType,
  type CUID,
  type Paginated,
  type WithAccess,
  type Nullable,
  type WithId,
  type DocumentListActions,
} from '@/shared';

export type DocumentDto = WithId<{
  description: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  expDate: Nullable<Date>;
  categoryId: Nullable<CUID>;
  assignedTo: Nullable<string>;
  status: DocumentStatus[];
  extension?: string;
}>;

export type UpdateDocumentDto = {
  description?: string;
  expDate?: Nullable<Date | string>;
  assignedTo?: Nullable<string>;
  categoryId?: Nullable<CUID>;
  status?: DocumentStatus[];
};

export type DocumentsAction = Extract<ActionType, 'addFile' | 'edit' | 'delete'>;

export type DocumentsStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'ARCHIVED';
export type DocumentsAssignStatus = 'ASSIGNED' | 'FREE';

export type AssigneeDto = {
  id: CUID;
  fullName: string;
  avatarId: Nullable<CUID>;
};

export type DocumentsListItemDto = WithId<{
  description: string;
  filePath: string;
  categoryId: Nullable<CUID>;
  createdAt: Date;
  extension: string;
  status: DocumentsStatus[];
  assignedTo: string | Nullable<AssigneeDto>;
  expDate: Nullable<Date>;
  category: string;
}>;

export type DocumentsListDto = Paginated<DocumentsListItemDto>;

export type DocumentsListWithAccessDto = WithAccess<
  DocumentsListDto,
  {
    columns: (keyof DocumentsListItemDto)[];
    actions: DocumentListActions[];
  }
>;

export type DocumentCategoryDto = WithId<{
  name: string;
}>;
