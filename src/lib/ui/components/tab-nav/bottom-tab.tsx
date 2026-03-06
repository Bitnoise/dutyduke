'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Icon } from '@/lib/ui/components';
import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { cn } from '@/shared';

export function BottomTab({ label, icon, href }: Omit<Tab, 'id'>) {
  const pathname = usePathname();
  const tNext = useNextTranslations('navigation');

  const lastHrefSegment = href.split('/').splice(-1)[0];

  return (
    <Link
      aria-label={tNext(label)}
      className={cn('p-2', {
        'bg-secondary-hover rounded-lg': pathname.includes(lastHrefSegment),
      })}
      href={href}
    >
      <Icon className="text-accent" name={icon} />
    </Link>
  );
}
