import { type Columns } from '@/shared';

export const ALL_BENEFITS_TABLE_COLUMNS: Columns = {
  name: {
    label: 'table.headers.name',
    sortKey: 'name',
    widthPx: 200,
  },
  note: {
    label: 'table.headers.note',
    sortKey: 'note',
    flex: 1,
  },
  assignedEmployees: {
    label: 'table.headers.assigned',
    widthPx: 150,
  },
  createdAt: {
    label: 'table.headers.createdAt',
    sortKey: 'createdAt',
    widthPx: 150,
  },
};
