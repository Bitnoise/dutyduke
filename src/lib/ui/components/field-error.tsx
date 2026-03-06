'use client';

import { FieldError as ReactAriaFieldError } from 'react-aria-components';
import { cn } from '@/shared';
import type { FieldErrorProps as ReactAriaFieldErrorProps } from 'react-aria-components';

export type FieldErrorProps = ReactAriaFieldErrorProps;

export function FieldError({ className, children, ...other }: FieldErrorProps): JSX.Element {
  const baseClasses = 'text-[0.625rem] leading-[0.75rem] text-warning';

  if (!children) {
    return <ReactAriaFieldError className={cn(baseClasses, className)} {...other} />;
  }

  return (
    <ReactAriaFieldError className={cn(baseClasses, className)} {...other}>
      {children}
    </ReactAriaFieldError>
  );
}
