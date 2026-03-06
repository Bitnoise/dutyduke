'use client';

import React, { type ComponentProps, type ReactNode, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { type BaseActionReturnType } from '@/shared';
import { usePreventAwayNavigation } from '@/lib/ui/hooks';
import { FormInfo } from '@/lib/ui';

type Props<TData, TValidation, TForm> = {
  focusInputOnError?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error?: string) => void;
  onEnter?: () => void;
  errorMessage?: string;
  children(form: TForm, errors?: TValidation): ReactNode;
  action(
    prevState: BaseActionReturnType<TData, TValidation, TForm>,
    formData: FormData,
    dictionaryName?: string,
  ): Promise<BaseActionReturnType<TData, TValidation, TForm>>;
  defaultState: BaseActionReturnType<TData, TValidation, TForm>;
  disablePreventAwayNavigation?: boolean;
} & Omit<ComponentProps<'form'>, 'action' | 'children' | 'onError'>;

export function Form<TData, TValidation, TForm>({
  onSuccess,
  children,
  errorMessage,
  defaultState,
  action,
  onError,
  onEnter,
  focusInputOnError = false,
  disablePreventAwayNavigation = false,
  ...other
}: Props<TData, TValidation, TForm>): JSX.Element {
  const [state, serverAction] = useActionState(action, defaultState);
  usePreventAwayNavigation(!disablePreventAwayNavigation);
  const formRef = useRef<HTMLFormElement>(null);

  const successHandler = useRef(onSuccess);
  const errorHandler = useRef(onError);

  useEffect(() => {
    errorHandler.current = onError;
  }, [onError]);

  useEffect(() => {
    successHandler.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const findInvalidField = () => {
      const invalidInput = document.querySelector('input[data-invalid="true"]') as HTMLInputElement;

      if (invalidInput) {
        timeoutId = setTimeout(() => {
          invalidInput.focus();
        }, 100);
      }
    };

    if (state.status === 'success') {
      successHandler.current?.(state.data);
    } else if (state.status === 'validation-error') {
      errorHandler.current?.();
    } else if (state.status === 'error' || state.status === 'api-error') {
      errorHandler.current?.(state.error);
      if (focusInputOnError) {
        findInvalidField();
      }
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state, focusInputOnError]);

  useEffect(() => {
    const handleClick = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (onEnter) {
          event.preventDefault();
          event.stopPropagation();
          onEnter();
        } else {
          formRef.current?.requestSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleClick);

    return () => {
      window.removeEventListener('keydown', handleClick);
    };
  }, [onEnter]);

  const formErrors = state.status === 'validation-error' ? state.errors : undefined;

  return (
    <form noValidate action={serverAction} ref={formRef} {...other}>
      {errorMessage && <FormInfo state={state} text={errorMessage} />}
      {children(state.form, formErrors)}
    </form>
  );
}
