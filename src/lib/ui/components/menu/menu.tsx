'use client';

import {
  Menu as RAMenu,
  MenuTrigger,
  Popover,
  type MenuProps,
  type MenuTriggerProps,
} from 'react-aria-components';
import React from 'react';
import { cn, MAX_MOBILE_VIEWPORT_WIDTH } from '@/shared';
import { Button } from '..';
import { type IconNames } from '../../icons';
import { useGetViewportDimensions } from '../../hooks/useGetViewportDimensions';

interface Props<T> extends MenuProps<T>, Omit<MenuTriggerProps, 'children' | 'trigger'> {
  label?: React.ReactNode;
  icon?: IconNames;
  trigger?: React.ReactNode;
  triggerClassName?: string;
}

export function Menu<T extends object>({
  children,
  className,
  triggerClassName,
  trigger,
  ...props
}: Props<T>) {
  const { width } = useGetViewportDimensions();

  return (
    <MenuTrigger {...props}>
      <div className={triggerClassName}>
        {trigger ?? <Button className="rotate-90 self-center" icon="context" intent="ghost" />}
      </div>
      <Popover
        className="rounded-xl bg-white px-2 py-3 shadow-menu"
        placement={width < MAX_MOBILE_VIEWPORT_WIDTH ? 'bottom' : 'bottom right'}
      >
        <RAMenu className={cn('outline-none', className)} {...props}>
          {children}
        </RAMenu>
      </Popover>
    </MenuTrigger>
  );
}
