'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/lib/ui';
import { type ActionReturnType, type Nullable } from '@/shared';

type BaseActionReturnType<TData, TValidation, TForm> = ActionReturnType<TForm, TData, TValidation>;

type Props<TForm, TData, TValidation> = {
  formStatus: BaseActionReturnType<TForm, TData, TValidation>;
  errorMessage?: Nullable<string>;
};

export function DocumentUploadErrorBar<TForm, TData, TValidation>({
  formStatus,
  errorMessage,
}: Props<TForm, TData, TValidation>) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false);
    }, 5000);

    return () => {
      clearTimeout(timeId);
    };
  }, [formStatus]);

  if (!show || formStatus.status !== 'validation-error' || !errorMessage) {
    return null;
  }

  return (
    <section
      aria-live="assertive"
      className="my-2 flex w-full gap-x-2 rounded border border-warning px-4 py-2 text-warning"
    >
      <Icon name="warning-full" /> {errorMessage}
    </section>
  );
}
