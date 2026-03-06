'use client';
import {
  GridList as RAGridList,
  type GridListProps,
  GridListItem as RAGridListItem,
  type GridListItemProps,
} from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { cn, type SearchParamKey, type OrderBy, type PropsWithClassName } from '@/shared';

import { Checkbox, TableRadioButton } from '@/lib/ui';
import { SortMenu } from '@/lib/ui/components/sort-menu';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';

type GridListHeaderProps = {
  searchParamKey: SearchParamKey;
  selectionMode?: 'single' | 'multiple' | 'none';
  sortKeys?: Array<{ key: OrderBy }>;
};

export function GridListHeader({
  searchParamKey,
  selectionMode,
  sortKeys = [],
  className,
  children,
}: PropsWithChildren<PropsWithClassName<GridListHeaderProps>>): JSX.Element {
  const tNext = useNextTranslations();
  const { selectedItems, updateSelectedItems, cleanSelectedItems } = useSelectItems(searchParamKey);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      updateSelectedItems('all');
    } else {
      cleanSelectedItems();
    }
  };

  return (
    <div className={cn('flex items-center gap-x-2.5 py-4', className)}>
      {selectionMode && selectionMode === 'multiple' && (
        <Checkbox
          aria-label={tNext('ctaLabels.selectAll')}
          isIndeterminate={Array.isArray(selectedItems) && selectedItems.length > 0}
          onChange={handleSelectAll}
        />
      )}
      {sortKeys.length > 0 && <SortMenu items={sortKeys} />}
      {children}
    </div>
  );
}

export function GridListItem({ children, className, ...other }: GridListItemProps) {
  return (
    <RAGridListItem
      className={cn(
        'flex items-center gap-x-2 min-w-0 hover:bg-hover data-[selected=true]:bg-hover transition-colors',
        {
          'cursor-pointer': !!other.href,
        },
        className,
      )}
      {...other}
    >
      {({ selectionMode, selectionBehavior }) => (
        <>
          {selectionMode === 'multiple' && selectionBehavior === 'toggle' && <Checkbox slot="selection" />}
          {selectionMode === 'single' && <TableRadioButton slot="selection" />}
          {children}
        </>
      )}
    </RAGridListItem>
  );
}

export function GridList<T extends object>({
  children,
  searchParamKey,
  ...other
}: GridListProps<T> & { searchParamKey: SearchParamKey }): JSX.Element {
  const { selectedItems, updateSelectedItems } = useSelectItems(searchParamKey);

  return (
    <RAGridList selectedKeys={selectedItems} onSelectionChange={updateSelectedItems} {...other}>
      {children}
    </RAGridList>
  );
}
