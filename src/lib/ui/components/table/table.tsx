'use client';

import { Table as RATable, type TableProps } from 'react-aria-components';
import { cn } from '@/shared';

export function Table({ className, ...other }: TableProps): JSX.Element {
  return <RATable className={cn('w-full', className)} {...other} />;
}
