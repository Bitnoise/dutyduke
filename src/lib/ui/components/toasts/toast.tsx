'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { cva } from 'class-variance-authority';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type Toast } from '@/lib/ui/components/toasts/types';
import { removeToastAtom } from '@/lib/ui/components/toasts/toast.atom';
import { cn, type WithId } from '@/shared';
import { Button, Icon } from '@/lib/ui';

const toastStyles = cva(
  'flex min-w-64 translate-y-full items-center justify-between gap-x-4 rounded-lg px-4 py-2 opacity-0 transition-[transform,opacity]',
  {
    variants: {
      intent: {
        success: 'border border-green-100 bg-green-50 text-green-default',
        error: 'bg-red-100 text-red-900',
      },
    },
  },
);

type Props = {
  toast: WithId<Toast>;
};

export function Toast({ toast }: Props): JSX.Element {
  const t = useTranslations('toasts');
  const [isEntering, setIsEntering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const removeToast = useSetAtom(removeToastAtom);

  const handleRemoveToast = useCallback(() => {
    removeToast(toast.id);
  }, [removeToast, toast.id]);

  useEffect(() => {
    const leavingTimeout = setTimeout(() => {
      setIsLeaving(true);
    }, 5000);

    const removingTimeout = setTimeout(() => {
      handleRemoveToast();
    }, 5200);

    return () => {
      clearTimeout(removingTimeout);
      clearTimeout(leavingTimeout);
    };
  }, [handleRemoveToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsEntering(true);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      aria-live="assertive"
      className={cn(toastStyles({ intent: toast.intent }), {
        'translate-y-0 opacity-100': isEntering,
        'translate-y-full opacity-0': isLeaving,
      })}
    >
      {toast.intent === 'success' && <Icon className="text-green-default" name="tick-circle" size={24} />}
      {toast.intent === 'error' && <Icon className="text-red-900" name="warning-2" size={24} />}
      <div>
        <h6>{t(toast.label)}</h6>
        {toast.description && <p>{t(toast.description)}</p>}
      </div>
      <Button
        className="text-black/10 hover:text-black/50 border-none bg-transparent"
        icon="close"
        intent="success"
        onClick={handleRemoveToast}
      />
    </div>
  );
}
