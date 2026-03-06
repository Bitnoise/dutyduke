'use client';

import { Cell as RACell, type CellProps } from 'react-aria-components';
import { cn } from '@/shared';

type Props = CellProps & {
  truncate?: boolean;
};

export function Cell({ className, truncate = true, ...other }: Props): JSX.Element {
  return (
    <RACell
      className={cn(
        'h-10 pr-4 text-sm',
        {
          'max-w-0 truncate': truncate,
        },
        className,
      )}
      {...other}
    />
  );
}
