import { type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';

export function Card({ id, children, className }: PropsWithClassName<PropsWithChildren<{ id?: string }>>) {
  return (
    <div
      className={cn(
        'min-h-full flex-1 rounded-lg bg-white px-4 pt-2 shadow-xl md:p-6 flex flex-col',
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
}
