'use client';

import { type InputProps, type TextFieldProps } from 'react-aria-components';
import { type ReactNode, useId, useState } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { TextInput } from './input';
import { Button, Label } from '.';

type TextInputProps = Omit<TextFieldProps, 'type'> & {
  label?: string | ReactNode;
  inputProps?: InputProps;
  errorMessage?: string;
  isSubmitting?: boolean;
  inputClassName?: string;
};

export function PasswordInput({
  errorMessage,
  isSubmitting,
  inputProps,
  label,
  id,
  className,
  inputClassName,
  ...restProps
}: PropsWithClassName<TextInputProps>): JSX.Element {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const generatedId = useId();

  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex w-full flex-col gap-y-1.5', className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="flex gap-2">
        <TextInput
          aria-label={label as string}
          className={cn(inputClassName)}
          errorMessage={errorMessage}
          id={inputId}
          inputProps={inputProps}
          isReadOnly={isSubmitting}
          type={isPasswordHidden ? 'password' : 'text'}
          {...restProps}
        />
        <Button
          aria-label={isPasswordHidden ? 'Password is hidden' : 'Password is visible'}
          className={cn('mt-1.5 text-accent', {
            'text-warning': !isPasswordHidden,
          })}
          icon={isPasswordHidden ? 'eye-slash' : 'eye'}
          intent="ghost"
          type="button"
          onClick={() => setIsPasswordHidden((prev) => !prev)}
        />
      </div>
    </div>
  );
}
