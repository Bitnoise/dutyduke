import { type Columns } from '@/shared';

export const ALL_EQUIPMENT_TABLE_COLUMNS: Columns = {
  name: {
    label: 'table.headers.name',
    sortKey: 'name',
    widthPx: 400,
  },
  signature: {
    label: 'table.headers.signature',
    sortKey: 'signature',
  },
  category: { label: 'table.headers.category' },
  status: {
    label: 'table.headers.status',
  },
  assignee: {
    label: 'table.headers.assigned',
  },
};

export const EQUIPMENT_STATUS = ['WORKING', 'IN_SERVICE', 'BROKEN', 'ARCHIVED'] as const;
