import { type Nullable, type Paginated, type WithAccess } from '@/shared';
import { type EmployeeAction } from '@/api/hris/employees/model/dtos';
import { type DocumentDto } from '@/api/hris/documents/model/dtos';

export type UpdateEquipmentDocumentDto = {
  description: string;
  expDate: Nullable<Date | string>;
};

export type EquipmentDocumentsWithAccessDto = WithAccess<
  Paginated<DocumentDto>,
  { actions: EmployeeAction[] }
>;
