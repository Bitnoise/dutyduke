'use client';

import { type PropsWithChildren } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type PropsWithClassName } from '@/shared';
import { useDynamicHeader } from '../hooks';

export function BasicHeader({ children, className }: PropsWithClassName<PropsWithChildren>) {
  const headerTitle = useDynamicHeader();
  const t = useTranslations('navigation');
  return (
    <div className="flex items-center justify-start py-3 md:py-2">
      <h1 className={cn('font-semibold text-xxl', className)}>{children ?? t(headerTitle)}</h1>
    </div>
  );
}
