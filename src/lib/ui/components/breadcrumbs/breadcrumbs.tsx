'use client';

import { type BreadcrumbsProps, Breadcrumbs as RABreadcrumbs } from 'react-aria-components';
import { usePathname } from 'next/navigation';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { Breadcrumb } from './breadcrumb';

type Props<T> = Omit<BreadcrumbsProps<T>, 'items'>;

export function Breadcrumbs<T extends object>(props: Props<T>) {
  const pathName = usePathname();
  const breadcrumbs = useBreadcrumbs(pathName);

  return (
    <RABreadcrumbs key={pathName} items={breadcrumbs} {...props}>
      {breadcrumbs.map(({ label, href }, index) => (
        <Breadcrumb
          key={label}
          breadCrumb={{
            label,
            href,
            isLast: index === breadcrumbs.length - 1,
          }}
        />
      ))}
    </RABreadcrumbs>
  );
}
