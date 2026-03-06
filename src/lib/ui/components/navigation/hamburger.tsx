'use client';

import { Button, type ButtonProps } from 'react-aria-components';
import { useTranslations as useNextTranslations } from 'next-intl';
import { cn } from '@/shared';

type Props = { isOpen: boolean } & ButtonProps;

export function Hamburger({ isOpen, ...other }: Props) {
  const tNext = useNextTranslations('navigation');

  return (
    <Button
      aria-label={tNext('hamburger')}
      className="group rounded p-1 outline-none transition-colors focus:bg-hover focus:ring focus:ring-ice-blue md:hidden"
      {...other}
    >
      <div className="flex size-6 flex-col items-center justify-center gap-y-1">
        <span
          className={cn('relative block h-1 w-full origin-center rounded-lg bg-accent transition-transform', {
            'top-2 rotate-45': isOpen,
          })}
        />
        <span
          className={cn('block h-1 w-full rounded-lg bg-accent opacity-100 transition-opacity', {
            'opacity-0': isOpen,
          })}
        />
        <span
          className={cn('relative block h-1 w-full origin-center rounded-lg bg-accent transition-transform', {
            'bottom-2 -rotate-45': isOpen,
          })}
        />
      </div>
    </Button>
  );
}
