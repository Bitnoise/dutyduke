'use client';

import { TableBody as RATableBody, type TableBodyProps } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { cn } from '@/shared';

export function TableBody<T extends object>({
  className,
  children,
  ...other
}: PropsWithChildren<TableBodyProps<T>>): JSX.Element {
  return (
    <RATableBody className={cn('w-full', className)} {...other}>
      {children}
    </RATableBody>
  );
}
