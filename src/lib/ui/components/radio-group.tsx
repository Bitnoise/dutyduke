'use client';
import { Label, type RadioGroupProps, RadioGroup as RARadioGroup } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { cn } from '@/shared';
import { FieldError } from './field-error';

type Props = RadioGroupProps & { label?: string; errorMessage?: string };

export function RadioGroup({
  children,
  label,
  className,
  errorMessage,
  ...other
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <RARadioGroup className={cn('flex flex-col gap-y-2', className)} {...other}>
      {label && <Label className="block pb-2 text-sm">{label}</Label>}
      {children}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </RARadioGroup>
  );
}
