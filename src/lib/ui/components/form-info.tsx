'use client';
import { type ReactNode, useLayoutEffect, useRef } from 'react';
import { type ActionReturnType, cn } from '@/shared';

export type Props<TForm, TData, TValidationError> = {
  className?: string;
  text: string | ReactNode;
  state: ActionReturnType<TForm, TData, TValidationError>;
};

export function FormInfo<TForm, TData, TValidationError>({
  className,
  text,
  state,
}: Props<TForm, TData, TValidationError>) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.scrollIntoView();
  }, [state]);

  if (state.status === 'idle' || state.status === 'validation-error') return null;

  return (
    <div className="w-full text-center" ref={ref}>
      <p
        aria-live="assertive"
        className={cn(
          'md:text-center',
          {
            'text-green-default': state.status === 'success',
            'text-warning': state.status === 'error' || state.status === 'api-error',
          },
          className,
        )}
      >
        {text}
      </p>
    </div>
  );
}
