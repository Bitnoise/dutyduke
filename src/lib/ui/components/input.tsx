'use client';

import { TextField, Input, type InputProps, type TextFieldProps, Text } from 'react-aria-components';
import { type ReactNode, useRef } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { FieldError } from '@/lib/ui';
import { Label } from './label';

export type TextInputProps = TextFieldProps & {
  label?: string | ReactNode;
  inputProps?: InputProps;
  errorMessage?: string;
  description?: string | ReactNode;
  inputClassName?: string;
};

export function TextInput({
  label,
  errorMessage,
  className,
  inputProps,
  description,
  isRequired,
  inputClassName,
  ...other
}: PropsWithClassName<TextInputProps>): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TextField
      className={cn('group w-full flex flex-col gap-y-1.5', className)}
      isRequired={isRequired}
      validationBehavior="aria"
      {...other}
    >
      {label && (
        <Label
          className={cn({
            'after:content-["*"]': isRequired,
          })}
        >
          {label}
        </Label>
      )}
      <Input
        className={cn(
          'border-grey bg-super-light-blue placeholder:text-dark-grey focus:border-accent disabled:border-super-light-blue disabled:placeholder:text-super-light-blue data-[invalid]:border-warning h-9 w-full rounded border px-3.5 text-black transition-colors',
          inputClassName,
        )}
        ref={inputRef}
        {...inputProps}
      />

      <FieldError className="font-light text-warning">{errorMessage}</FieldError>
      {description && (
        <Text className="text-text-helper block py-1 text-xxs" slot="description">
          {description}
        </Text>
      )}
    </TextField>
  );
}
