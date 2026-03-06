'use client';

import { type PropsWithChildren } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { atom, useAtom } from 'jotai';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, SearchInput } from '@/lib/ui/components';
import { cn } from '@/shared';

const expandedListAtom = atom(true);

export function ExpandableEmployeesList({ children }: PropsWithChildren): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const [isExpanded, setIsExpanded] = useAtom(expandedListAtom);

  const toggleList = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        'relative hidden lg:block min-size-full shrink-0 basis-8 bg-white transition-[flex_basis] rounded-lg rounded-r-sm',
        {
          'basis-72 -mr-0.5 px-2.5 pb-2.5 overflow-y-auto overflow-x-hidden': isExpanded,
          'mt-0 -mr-6 px-0': !isExpanded,
        },
      )}
    >
      <div className={cn({ 'sticky left-0 top-0 z-10 bg-white pt-2.5': isExpanded })}>
        <Button
          aria-label={isExpanded ? tNext('navigation.fold') : tNext('navigation.expand')}
          className={cn('h-14 w-auto text-accent transition-transform border-0', {
            'rounded-0': isExpanded,
            'bg-accent text-white w-10 h-10 rounded-tl-lg rounded-tr-none rounded-b-md hover:bg-accent':
              !isExpanded,
          })}
          icon="personal-card"
          iconPlacement="left"
          intent="ghost"
          onClick={toggleList}
        >
          {isExpanded && <p className="text-accent">{t('employees.list.hide')}</p>}
        </Button>
        <div
          className={cn('py-2 opacity-100', {
            'opacity-0': !isExpanded,
          })}
        >
          <SearchInput
            aria-label={tNext('ctaLabels.search')}
            placeholder={tNext('ctaLabels.search').toLowerCase()}
          />
        </div>
      </div>
      <div
        className={cn('absolute w-full pr-6 pb-2.5 transition-opacity top-26 opacity-100', {
          'opacity-0 pr-0': !isExpanded,
        })}
      >
        {children}
      </div>
    </aside>
  );
}
