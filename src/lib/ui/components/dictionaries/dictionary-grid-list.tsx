'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { cn, type Columns, type PropsWithClassName } from '@/shared';
import { useColumns } from '@/lib/ui/hooks';
import { type DictionaryEntity } from '@/shared/types/dictionary';
import { DictionaryItemMenu } from './dictionary-item-menu';

const ALL_DICTIONARY_TABLE_COLUMNS: Columns = {
  name: {
    label: 'table.headers.name',
  },
};
type Props = {
  entities: DictionaryEntity[];
  onDelete: (itemId: string) => Promise<void>;
};

export function DictionaryGridList({
  entities,
  className,
  onDelete,
}: PropsWithClassName<Props>): JSX.Element {
  const columnsToShow = useColumns(ALL_DICTIONARY_TABLE_COLUMNS, Object.keys(ALL_DICTIONARY_TABLE_COLUMNS));
  const tNext = useNextTranslations('company.equipment');

  return (
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="EQUIPMENT"
        selectionMode="multiple"
      />
      <GridList
        aria-label={tNext('title')}
        className={cn(className)}
        searchParamKey={'EQUIPMENT'}
        selectionMode="multiple"
      >
        {entities.map((entity) => (
          <GridListItem
            key={entity.id}
            className="min-w-0 border-b border-b-divider py-2"
            id={entity.id}
            textValue={entity.name}
          >
            <div className="flex min-w-0 flex-col">
              <div className="flex min-w-0 gap-x-3 text-sm">
                {'name' in columnsToShow && (
                  <p className="block max-w-[14.375rem] truncate md:max-w-[21.875rem] lg:max-w-[31.25rem]">
                    {entity.name}
                  </p>
                )}
              </div>
            </div>
            <div className="ml-auto">
              <DictionaryItemMenu
                actions={['delete']}
                itemId={entity.id}
                variant="small"
                onDelete={onDelete}
              />
            </div>
          </GridListItem>
        ))}
      </GridList>
    </>
  );
}
