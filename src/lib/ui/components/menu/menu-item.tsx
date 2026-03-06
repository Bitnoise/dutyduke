'use client';

import { type MenuItemProps, MenuItem as RAMenuItem } from 'react-aria-components';
import { cn } from '@/shared';

export function MenuItem({ className, ...other }: MenuItemProps) {
  const textValue = other.textValue || (typeof other.children === 'string' ? other.children : undefined);

  return (
    <RAMenuItem
      className={cn(
        'cursor-pointer rounded-lg px-2 py-1.5 transition-color text-sm outline-none hover:bg-hover data-[focused]:bg-hover data-[disabled]:opacity-50',
        className,
      )}
      textValue={textValue}
      {...other}
    >
      {other.children}
    </RAMenuItem>
  );
}
