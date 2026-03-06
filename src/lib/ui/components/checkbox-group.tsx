'use client';

import { type CheckboxGroupProps, CheckboxGroup as RACheckboxGroup, Text } from 'react-aria-components';
import { type PropsWithChildren } from 'react';
import { FieldError, Label } from '@/lib/ui';

type Props = CheckboxGroupProps & {
  label?: string;
  errorMessage?: string;
  description?: string;
};

export function CheckboxGroup({
  children,
  label,
  description,
  errorMessage,
  ...other
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <RACheckboxGroup {...other}>
      {label && <Label>{label}</Label>}
      {children}
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </RACheckboxGroup>
  );
}
