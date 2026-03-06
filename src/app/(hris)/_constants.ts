import { type Columns } from '@/shared';

export const EMPLOYEE_EQUIPMENT_TABLE_COLUMNS: Columns = {
  signature: {
    label: 'table.headers.id',
    sortKey: 'signature',
  },
  category: { label: 'table.headers.category' },
  name: {
    label: 'table.headers.name',
    sortKey: 'name',
  },
  status: {
    label: 'table.headers.status',
  },
};

export const EMPLOYEE_BENEFITS_TABLE_COLUMNS: Columns = {
  benefit: {
    label: 'table.headers.name',
    sortKey: 'name',
  },
  startDate: {
    label: 'table.headers.startDate',
    sortKey: 'startDate',
  },
};
