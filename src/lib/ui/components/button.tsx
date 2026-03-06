'use client';

import { forwardRef, type ReactNode, type PropsWithChildren } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ButtonProps as RAButtonProps, Button as RAButton } from 'react-aria-components';
import type { PropsWithClassName, Size } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Icon } from '@/lib/ui';
import { type IconNames } from '@/lib/ui/icons';

const buttonStyles = cva(
  'cursor-pointer whitespace-nowrap rounded border text-sm transition-colors focus:border-ice-blue disabled:cursor-not-allowed disabled:border-super-light-grey disabled:bg-super-light-grey disabled:text-medium-grey',
  {
    variants: {
      intent: {
        primary: 'border-accent bg-accent text-white hover:bg-medium-accent active:bg-dark-accent',
        secondary:
          'border-secondary-default bg-secondary-default text-accent hover:bg-secondary-hover active:bg-secondary-pressed',
        tertiary:
          'border border-accent bg-white text-accent hover:bg-light-ice-blue active:bg-medium-ice-blue',
        danger: 'border-light-red bg-light-red text-white hover:bg-medium-red active:bg-dark-red',
        success: 'bg-success-default hover:bg-success-hover active:bg-success-pressed text-white',
        ghost:
          'border-transparent bg-transparent text-accent hover:bg-secondary-hover active:bg-secondary-pressed disabled:border-transparent disabled:bg-transparent disabled:opacity-70',
      },
      size: {
        sm: 'px-2 py-1',
        md: 'p-2',
        lg: 'p-2.5',
      },
      iconOnly: {
        true: 'size-8 shrink-0 rounded p-0',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      iconOnly: false,
    },
  },
);

export type ButtonProps = Omit<RAButtonProps, 'onPress'> &
  VariantProps<typeof buttonStyles> & {
    icon?: IconNames;
    iconPlacement?: 'left' | 'right';
    isLoading?: boolean;
    onClick?: () => void;
    title?: string | ReactNode;
    iconSize?: Size;
    iconClassName?: string;
    preventFocusOnPress?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<PropsWithClassName<ButtonProps>>>(
  (
    {
      intent,
      size,
      children,
      className,
      icon,
      isLoading,
      isDisabled,
      title,
      iconPlacement = 'left',
      iconClassName,
      onClick,
      iconSize = 'xs',
      ...other
    },
    ref,
  ) => {
    const iconOnly = icon && !children;
    return (
      <RAButton
        preventFocusOnPress
        className={cn(buttonStyles({ intent, size, iconOnly }), className, {
          'pointer-events-none': isLoading,
        })}
        isDisabled={isDisabled}
        ref={ref}
        onPress={onClick} // removes warning from console
        {...other}
      >
        <div className="flex items-center justify-center">
          <span
            className={cn('flex flex-nowrap items-center gap-2 justify-center opacity-100', {
              'gap-0': iconOnly,
            })}
            title={title as string}
          >
            {icon && iconPlacement === 'left' && (
              <Icon
                className={cn({ 'pl-0': iconOnly, 'animate-spin': isLoading }, iconClassName)}
                name={isLoading ? 'spinner' : icon}
                size={iconSize}
              />
            )}
            {children && (
              <span
                className={cn('block', {
                  'pl-2': icon && iconPlacement === 'right',
                  'pr-2': icon && iconPlacement === 'left',
                })}
              >
                {children}
              </span>
            )}
            {icon && iconPlacement === 'right' && (
              <Icon
                className={cn({ 'pl-0': iconOnly, 'animate-spin': isLoading }, iconClassName)}
                name={isLoading ? 'spinner' : icon}
                size={iconSize}
              />
            )}
          </span>
        </div>
      </RAButton>
    );
  },
);

Button.displayName = 'Button';
