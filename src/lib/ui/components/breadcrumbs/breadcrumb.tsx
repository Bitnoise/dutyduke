'use client';

import Link from 'next/link';
import { type BreadcrumbProps, Breadcrumb as RABreadcrumb } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn } from '@/shared';
import { Icon } from '..';

type Breadcrumb = {
  label: string;
  href: string;
  isLast?: boolean;
};

type Props = BreadcrumbProps & {
  breadCrumb: Breadcrumb;
};

export function Breadcrumb({ breadCrumb, ...restProps }: Props) {
  const { label, href, isLast } = breadCrumb;
  const t = useTranslations();

  return (
    <RABreadcrumb className="flex gap-1" {...restProps}>
      <Link
        className={cn('text-xs hover:underline', {
          'text-accent font-semibold cursor-default hover:no-underline': isLast,
        })}
        href={isLast ? '' : href}
      >
        {t(label)}
      </Link>
      {!isLast && <Icon name="chevron" size={16} />}
    </RABreadcrumb>
  );
}
