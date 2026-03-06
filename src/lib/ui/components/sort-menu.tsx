'use client';

import { type MenuProps } from 'react-aria-components';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { type OrderByKey, type SortDir, type OrderBy } from '@/shared';
import { useQueryParams } from '@/lib/ui/hooks';
import { Button } from '@/lib/ui';

type Props<T extends { key: OrderBy }> = MenuProps<T> & {
  items: Array<T>;
};
export function SortMenu<T extends { key: OrderBy }>({ items, ...other }: Props<T>): JSX.Element {
  const tNext = useNextTranslations('sortMenu');
  const { searchParams, handleSort } = useQueryParams();

  return (
    <Menu
      aria-label={tNext('sortMenu')}
      className="flex flex-col"
      items={items}
      trigger={<Button icon="sorting" intent="tertiary" />}
      {...other}
    >
      {(item) => {
        const [key, dir] = item.key.split('-') as [OrderByKey, SortDir];
        return (
          <MenuItem
            key={item.key}
            id={item.key}
            isDisabled={searchParams.get('sort') === item.key}
            onAction={() => handleSort(key, dir)}
          >
            {tNext(key, { dir: tNext(dir) })}
          </MenuItem>
        );
      }}
    </Menu>
  );
}
