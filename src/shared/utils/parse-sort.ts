import { type OrderBy, type OrderByKey, type SortDir } from '@/shared/types/sort';

export function parseSort(orderBy?: OrderBy) {
  if (!orderBy || typeof orderBy !== 'string') {
    return undefined;
  }

  const [key, dir] = orderBy.split('-') as [OrderByKey, SortDir];

  if (!key || !dir) {
    return undefined;
  }

  return {
    [key]: dir,
  };
}
