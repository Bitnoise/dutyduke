import { type Item } from '@/lib/ui/components/combo-box/types';

export const WORK_ORDER_STATUS_ITEMS: Item[] = [
  { key: 'CREATED', label: 'scheduled' },
  { key: 'IN_PROGRESS', label: 'inProgress' },
  { key: 'COMPLETED', label: 'completed' },
  { key: 'ON_HOLD', label: 'onHold' },
  { key: 'CANCELLED', label: 'cancelled' },
];
