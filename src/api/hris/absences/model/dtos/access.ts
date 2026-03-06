import { type AbsenceAction } from './absence.dto';

export const ABSENCE_LIST_ACCESS: Record<'OWNER' | 'EMPLOYEE', AbsenceAction[]> = {
  OWNER: ['approve', 'reject', 'create', 'filter', 'select', 'delete'],
  EMPLOYEE: [],
};
