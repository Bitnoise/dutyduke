'use client';

import { useFormStatus } from 'react-dom';
import { type TranslationValues, useTranslations } from 'next-intl';

type FormState = {
  name: string | undefined;
  isSubmitting: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
  errorMessage: string | undefined;
};

type Props = {
  prefix?: string;
  name?: string;
  errors?: Record<string, string[] | undefined>;
  translationValues?: TranslationValues;
  children(formState: FormState): React.ReactNode;
  isReadOnly?: boolean;
};

export function FormControl({ name, prefix, errors, translationValues, children, isReadOnly }: Props) {
  const { pending } = useFormStatus();
  const t = useTranslations();

  const errorMessage = name && errors?.[name]?.[0];

  return children({
    name: prefix ? `${prefix}-${name}` : name,
    isInvalid: !!name && !!errors?.[name]?.length,
    errorMessage: errorMessage ? t(errorMessage, translationValues) : undefined,
    isSubmitting: pending,
    isReadOnly: isReadOnly || pending,
  });
}
