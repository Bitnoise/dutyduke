'use client';

import { cn, type OrderByKey } from '@/shared';
import { useQueryParams } from '../hooks';
import { Icon } from './icon';

type Props = {
  orderBy: OrderByKey;
};

export function SortButton({ orderBy }: Props) {
  const { handleSort, currSort } = useQueryParams();
  const { sortDir, sortName } = currSort;

  return (
    <button
      aria-label={`Sort by: ${orderBy} ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
      className="flex flex-col items-center justify-center gap-y-0.5"
      onClick={() => handleSort(orderBy)}
    >
      <>
        <Icon
          className={cn('text-grey', {
            'text-dark-grey': sortDir === 'asc' && orderBy === sortName,
          })}
          name="sortAsc"
          size={6}
        />
        <Icon
          className={cn('text-grey', {
            'text-dark-grey': sortDir === 'desc' && orderBy === sortName,
          })}
          name="sortDesc"
          size={6}
        />
      </>
    </button>
  );
}
