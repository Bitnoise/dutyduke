'use client';
import { Cell, Row as RARow, useTableOptions, type RowProps } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { cn } from '@/shared';
import { Checkbox } from '../checkbox';
import { TableRadioButton } from '../table-radio-button';

export function Row<T extends object>({ className, children, ...other }: PropsWithChildren<RowProps<T>>) {
  const { selectionMode } = useTableOptions();

  return (
    <RARow
      className={cn(
        'h-10 border-b border-b-divider transition-colors hover:bg-hover data-[selected=true]:bg-hover',
        {
          'cursor-pointer': !!other.href,
        },
        className,
      )}
      {...other}
    >
      {selectionMode === 'multiple' && (
        <Cell className="w-[50px] pl-4">
          <Checkbox slot="selection" />
        </Cell>
      )}
      {selectionMode === 'single' && (
        <Cell className="pl-4">
          <TableRadioButton className="rounded-full" slot="selection" />
        </Cell>
      )}
      {children}
    </RARow>
  );
}
