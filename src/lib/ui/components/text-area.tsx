'use client';

import {
  TextArea as RATextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from 'react-aria-components';
import { type ReactNode } from 'react';
import { Label, FieldError } from '@/lib/ui';
import { cn } from '@/shared';

type Props = TextFieldProps & {
  label?: string | ReactNode;
  inputProps?: Omit<TextAreaProps, 'className'>;
  errorMessage?: string;
  inputClassName?: string;
};

export function TextArea({
  className,
  inputClassName,
  label,
  inputProps,
  errorMessage,
  ...other
}: Props): JSX.Element {
  return (
    <TextField className={cn(className)} {...other}>
      {label && <Label>{label}</Label>}
      <RATextArea
        className={cn(
          'w-full resize-none rounded border border-grey bg-super-light-blue p-2 text-black transition-colors placeholder:text-dark-grey focus:border-accent disabled:border-0 disabled:placeholder:text-super-light-blue data-[invalid]:border-warning',
          inputClassName,
        )}
        rows={4}
        {...inputProps}
      />
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  );
}
