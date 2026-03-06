'use client';
import { type ReactNode, useId, type PropsWithChildren } from 'react';
import { SegmentLabel } from '@/lib/ui/components/segment-label';
import { cn, type PropsWithClassName } from '@/shared';

type Props = {
  label: string | ReactNode;
};
export function ContentBlock({
  label,
  children,
  className,
}: PropsWithClassName<PropsWithChildren<Props>>): JSX.Element {
  const id = useId();

  return (
    <div className="flex w-full flex-col">
      <SegmentLabel as="heading-small" id={id}>
        {label}
      </SegmentLabel>
      <div aria-describedby={id} className={cn('text-sm font-medium', className)}>
        {children}
      </div>
    </div>
  );
}
