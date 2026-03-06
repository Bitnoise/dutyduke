'use client';

import { TableHeader as RATableHeader, useTableOptions, type TableHeaderProps } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type Columns } from '@/shared';
import { Checkbox } from '../checkbox';
import { Column } from './column';

type Props<T> = {
  columns: Columns;
} & Omit<TableHeaderProps<T>, 'columns'>;

export function TableHeader<T extends object>({
  className,
  columns,
  children,
  ...other
}: PropsWithChildren<Props<T>>): JSX.Element {
  const { selectionMode } = useTableOptions();
  const t = useTranslations();

  return (
    <RATableHeader className={cn('h-10 border-b border-b-divider text-left text-sm', className)} {...other}>
      {selectionMode === 'multiple' && (
        <Column className="w-[50px] pl-4">
          <Checkbox slot="selection" />
        </Column>
      )}
      {selectionMode === 'single' && (
        <Column className="pl-4">
          <div slot="selection" />
        </Column>
      )}
      {Object.keys(columns).map((key, index) => {
        if (!(key in columns)) return null;

        const columnConfig = columns[key];
        return (
          <Column
            key={key}
            columnConfig={columnConfig}
            isRowHeader={index === 0}
            sortKey={columnConfig.sortKey}
          >
            {t(columnConfig.label)}
          </Column>
        );
      })}
      {children}
    </RATableHeader>
  );
}
