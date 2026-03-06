'use client';

import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Icon } from '@/lib/ui/components';
import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { cn, type PropsWithClassName } from '@/shared';
import { BottomTab } from '@/lib/ui/components/tab-nav/bottom-tab';

type Props = {
  tabs: Omit<Tab, 'id'>[];
};

export function BottomTabNav({ tabs, className }: PropsWithClassName<Props>) {
  const tNext = useNextTranslations('navigation');
  const [isExpanded, setIsExpanded] = useState(false);

  if (tabs.length <= 5) {
    return (
      <ul
        className={cn(
          'fixed bottom-0 inset-x-0 flex justify-evenly items-center border-t border-t-divider bg-white',
          className,
        )}
      >
        {tabs.map((link) => (
          <li key={link.label} className="relative flex h-16 items-center justify-center">
            <BottomTab href={link.href} icon={link.icon} label={link.label} />
          </li>
        ))}
      </ul>
    );
  }

  const firstRowTabs = tabs.slice(0, 4);

  return (
    <ul
      className={cn(
        'fixed bottom-0 inset-x-0 grid grid-cols-5 translate-y-16 items-center border-t border-t-divider transition-transform bg-white',
        {
          'translate-y-0': isExpanded,
        },
        className,
      )}
    >
      {firstRowTabs.map((link) => (
        <li key={link.label} className="flex h-16 items-center justify-center">
          <BottomTab href={link.href} icon={link.icon} label={link.label} />
        </li>
      ))}
      <li className="flex h-16 items-center justify-center">
        <button
          aria-label={tNext('ctaLabels.more')}
          className={cn('rotate-180 transition-transform', {
            'rotate-0': isExpanded,
          })}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Icon className="text-accent" name="arrow2-down" />
        </button>
      </li>
      {tabs.slice(4).map((link) => (
        <li key={link.label} className="flex h-16 items-center justify-center">
          <BottomTab href={link.href} icon={link.icon} label={link.label} />
        </li>
      ))}
    </ul>
  );
}
