'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { type PropsWithChildren } from 'react';

const chipStyles = cva('rounded-[1.1875rem] px-1 py-px text-xs text-white', {
  variants: {
    intent: {
      ok: 'bg-green-default',
      critical: 'bg-warning',
      warning: 'bg-yellow',
      info: 'bg-accent',
    },
  },
});

export function Chip({
  children,
  intent = 'ok',
}: PropsWithChildren<VariantProps<typeof chipStyles>>): JSX.Element {
  return <span className={chipStyles({ intent })}>{children}</span>;
}
