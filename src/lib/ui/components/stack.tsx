import { type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';

type Props = {
  direction?: 'row' | 'column';
  gapX?: number | string;
  gapY?: number | string;
};
export function Stack({
  direction = 'row',
  gapX = '1rem',
  gapY = '0.5rem',
  children,
  className,
}: PropsWithClassName<PropsWithChildren<Props>>) {
  const parsedGapX = typeof gapX === 'number' ? `${gapX}px` : gapX;
  const parsedGapY = typeof gapY === 'number' ? `${gapY}px` : gapY;

  return (
    <div
      className={cn(
        'flex',
        {
          'flex-row': direction === 'row',
          'flex-col': direction === 'column',
        },
        className,
      )}
      style={{
        gap: `${parsedGapY} ${parsedGapX}`,
      }}
    >
      {children}
    </div>
  );
}
