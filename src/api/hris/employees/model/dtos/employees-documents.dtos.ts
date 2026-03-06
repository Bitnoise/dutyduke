import { type Paginated, type WithAccess, type Nullable } from '@/shared/types';
import { type EmployeeAction } from './employee.dto';

export type UpdateEmployeeDocumentDto = {
  description: string;
  expDate: Date | string | null;
};

export type EmployeeDocumentDto = {
  id: string;
  description: string;
  expDate: Nullable<Date>;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  extension?: string;
};

export type EmployeeDocumentsWithAccessDto = WithAccess<
  Paginated<EmployeeDocumentDto>,
  {
    actions: EmployeeAction[];
  }
>;
