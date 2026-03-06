'use client';

import {
  TextArea as RATextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from 'react-aria-components';
import { type ChangeEvent, type ReactNode, useState } from 'react';
import { Label, FieldError } from '@/lib/ui';
import { cn, TEXT_AREA_MAX_CHARS, TEXT_AREA_WARNING_CHARS } from '@/shared';

type Props = TextFieldProps & {
  label?: string | ReactNode;
  inputProps?: Omit<TextAreaProps, 'className'>;
  errorMessage?: string;
  inputClassName?: string;
  limitChars?: boolean;
};

export function TextArea({
  className,
  inputClassName,
  label,
  inputProps,
  errorMessage,
  limitChars,
  ...other
}: Props): JSX.Element {
  const [text, setText] = useState(other?.defaultValue ?? '');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textValue = e.target.value;
    if (!limitChars) {
      setText(textValue);
      return;
    }

    if (textValue.length <= TEXT_AREA_MAX_CHARS) {
      setText(textValue);
    }
  };

  return (
    <TextField className={cn(className)} {...other}>
      {label && <Label>{label}</Label>}
      <RATextArea
        className={cn(
          'w-full resize-none rounded border border-grey bg-super-light-blue p-2 text-black transition-colors placeholder:text-dark-grey focus:border-accent disabled:border-0 disabled:placeholder:text-super-light-blue data-[invalid]:border-warning',
          inputClassName,
        )}
        rows={4}
        value={text}
        onChange={handleChange}
        {...inputProps}
      />
      {limitChars && (
        <div
          className={cn('text-right text-sm text-gray-400', {
            'text-orange-400': text.toString().length >= TEXT_AREA_WARNING_CHARS,
            'text-warning': text.toString().length === TEXT_AREA_MAX_CHARS,
          })}
        >
          {text.toString().length} / {TEXT_AREA_MAX_CHARS}
        </div>
      )}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  );
}
