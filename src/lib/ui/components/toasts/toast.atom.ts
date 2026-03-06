import { atom } from 'jotai';
import { createId } from '@paralleldrive/cuid2';
import { type Toast } from '@/lib/ui/components/toasts/types';
import { type WithId } from '@/shared';

export const toastsAtom = atom<WithId<Toast>[]>([]);

export const addToastAtom = atom(null, (_get, set, newValue: Toast) =>
  set(toastsAtom, (prev) => [...prev, { id: createId(), ...newValue }]),
);

export const removeToastAtom = atom(null, (get, set, toastId: string) =>
  set(toastsAtom, (prev) => prev.filter((toast) => toast.id !== toastId)),
);
