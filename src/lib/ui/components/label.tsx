'use client';

import { Label as RALabel, type LabelProps } from 'react-aria-components';
import { cn } from '@/shared';
export function Label({ children, className, ...other }: LabelProps) {
  return (
    <RALabel {...other} className={cn('text-xs text-dark-grey', className)}>
      {children}
    </RALabel>
  );
}
