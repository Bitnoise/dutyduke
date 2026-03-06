import { type Columns } from '@/shared';

export const ALL_DOCUMENTS_TABLE_COLUMNS: Columns = {
  description: {
    label: 'table.headers.description',
    sortKey: 'description',
    widthPx: 300,
  },
  category: { label: 'table.headers.category', widthPx: 200 },
  expDate: {
    label: 'table.headers.expDate',
    sortKey: 'expDate',
    widthPx: 150,
  },
  extension: {
    label: 'table.headers.extension',
    widthPx: 50,
  },
  createdAt: {
    label: 'table.headers.createdAt',
    sortKey: 'createdAt',
    widthPx: 150,
  },
  assignedTo: {
    label: 'table.headers.assigned',
  },
};

export const DOCUMENTS_STATUS = ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'ARCHIVED'] as const;

export const ICONS_MAP = {
  equipment: 'equipment-avatar',
  subscription: 'subscription',
};

export const DOCUMENTS_CATEGORIES_PRIORITY: Record<string, number> = {
  Employee: 1,
  Equipment: 2,
};

export const DEFAULT_CATEGORY_PRIORITY = 99;
