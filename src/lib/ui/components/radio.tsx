'use client';
import { type PropsWithChildren } from 'react';
import { Radio as RARadio, type RadioProps } from 'react-aria-components';
import { cn } from '@/shared';

export function Radio({ children, className, ...other }: PropsWithChildren<RadioProps>) {
  return (
    <RARadio className={cn('flex text-sm gap-x-4 items-center group', className)} {...other}>
      <span className="flex size-[1.125rem] items-center justify-center rounded-full ring-1 ring-inset ring-dark-grey group-data-[invalid]:ring-2 group-data-[selected]:ring-2 group-data-[focused]:ring-accent group-data-[invalid]:ring-warning group-data-[selected]:ring-accent">
        <span className="size-0 rounded-full bg-accent transition-all group-data-[selected]:size-2.5"></span>
      </span>
      {children}
    </RARadio>
  );
}
