import { type ReactNode, type PropsWithChildren } from 'react';
import { type PropsWithClassName, cn } from '@/shared';

export function Tile({
  label,
  children,
  className,
}: PropsWithClassName<PropsWithChildren<{ label: string | ReactNode }>>) {
  return (
    <div
      className={cn(
        'flex shink-0 h-[74px] min-w-[177px] flex-col justify-center rounded-lg border border-gray-200 px-4',
        className,
      )}
    >
      <h3 className="whitespace-nowrap text-xs">{label}</h3>
      {children}
    </div>
  );
}
