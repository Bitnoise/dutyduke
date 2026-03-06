'use client';

import { type ColumnProps, Column as RAColumn } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { cn, type OrderByKey, getColumnLayout, type ColumnConfig } from '@/shared';
import { SortButton } from '../sort-button';
import { useQueryParams } from '../../hooks';

type Props = ColumnProps & {
  sortKey?: OrderByKey;
  columnConfig?: ColumnConfig;
};

export function Column({
  sortKey,
  columnConfig,
  children,
  className,
  style,
  ...other
}: PropsWithChildren<Props>) {
  const { handleSort } = useQueryParams();
  const layout = getColumnLayout(columnConfig);

  return (
    <RAColumn
      className={cn(
        {
          'cursor-pointer': sortKey,
          'cursor-default': !sortKey,
        },
        layout.className,
        className,
      )}
      style={{ ...layout.style, ...style }}
      {...other}
    >
      <div className="flex gap-x-2" onClick={() => sortKey && handleSort(sortKey)}>
        {children}
        {sortKey && <SortButton orderBy={sortKey} />}
      </div>
    </RAColumn>
  );
}
