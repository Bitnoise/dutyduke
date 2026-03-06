import { type EquipmentListItemDto } from '@/api/hris/resources/model/dtos';
import { type DocumentsListItemDto } from '@/api/hris/documents/model/dtos';
import { type DocumentListType, type EquipmentListType, type UserTableColumns } from '../types';

type TableColsAccess = Record<string, UserTableColumns[]>;

type EquipmentAccessibleCols = Record<
  EquipmentListType,
  Record<'OWNER' | 'EMPLOYEE', (keyof EquipmentListItemDto)[]>
>;

type DocumentsAccessibleCols = Record<
  DocumentListType,
  Record<'OWNER' | 'EMPLOYEE', (keyof DocumentsListItemDto)[]>
>;

export const TABLE_COLS_ACCESS: TableColsAccess = {
  OWNER: ['lastName', 'firstName', 'role', 'phone', 'workEmail', 'status'],
  EMPLOYEE: ['lastName', 'firstName', 'workEmail'],
};

export const EQUIPMENT_ACCESSIBLE_COLS: EquipmentAccessibleCols = {
  companyEquipment: {
    OWNER: ['name', 'signature', 'category', 'status', 'assignee'],
    EMPLOYEE: ['name', 'signature', 'category'],
  },
  employeeEquipment: {
    OWNER: ['signature', 'name', 'category', 'status'],
    EMPLOYEE: ['signature', 'name', 'category', 'status'],
  },
  employeeAssignEquipment: {
    OWNER: ['signature', 'name', 'category', 'status', 'assignee'],
    EMPLOYEE: ['signature', 'name', 'category', 'status', 'assignee'],
  },
};

export const DOCUMENT_ACCESSIBLE_COLS: DocumentsAccessibleCols = {
  companyDocument: {
    OWNER: [
      'id',
      'description',
      'extension',
      'category',
      'status',
      'filePath',
      'createdAt',
      'expDate',
      'assignedTo',
    ],
    EMPLOYEE: ['id', 'description', 'extension', 'filePath', 'createdAt'],
  },
};
