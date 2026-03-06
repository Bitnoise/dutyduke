import { type HTMLAttributes } from 'react';
import { cn } from '@/shared';
import { Icon } from '../icon';

export function Tag({ className, children, ...other }: HTMLAttributes<HTMLButtonElement>): JSX.Element {
  return (
    <button
      className={cn(
        'flex max-h-6 w-max shrink-0 items-center gap-x-1 rounded border border-grey bg-hover px-1 py-0.5 text-sm outline-none focus:border-accent',
        className,
      )}
      type="button"
      {...other}
    >
      {children}
      <Icon name="close" size="xs" />
    </button>
  );
}
