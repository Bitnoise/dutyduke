'use client';

import { useAtomValue } from 'jotai';
import { Toast } from '@/lib/ui/components/toasts/toast';
import { List } from '@/lib/ui';
import { toastsAtom } from './toast.atom';

export function ToastQueue(): JSX.Element | null {
  const toasts = useAtomValue(toastsAtom);

  return (
    <List className="fixed right-4 top-20 z-[120] md:top-4" items={toasts}>
      {(toast) => <Toast key={toast.id} toast={toast} />}
    </List>
  );
}
