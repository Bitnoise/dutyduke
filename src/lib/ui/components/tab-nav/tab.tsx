'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { cn, getLastHrefSegment } from '@/shared';
import { Icon } from '@/lib/ui';

type Props = {
  tab: Tab;
  intent?: 'default' | 'menu';
};

export function Tab({ tab, intent = 'default' }: Props): JSX.Element {
  const pathname = usePathname();
  const parsedPathname = getLastHrefSegment(pathname);
  const lastHrefSegment = getLastHrefSegment(tab.href);
  const t = useTranslations('navigation');
  const tNext = useNextTranslations('navigation');

  return (
    <Link
      aria-label={tNext(tab.label)}
      className={cn('flex items-center gap-x-2 outline-none hover:bg-hover focus:bg-hover', {
        'p-4 transition-colors border-b-[3px] border-transparent text-sm rounded-t-lg': intent === 'default',
        'px-4 py-2 rounded': intent === 'menu',
        'border-accent': parsedPathname === lastHrefSegment && intent === 'default',
        'bg-hover': parsedPathname === lastHrefSegment && intent === 'menu',
      })}
      href={tab.href}
    >
      <Icon className="text-accent" name={tab.icon} />
      <span>{t(tab.label)}</span>
    </Link>
  );
}
